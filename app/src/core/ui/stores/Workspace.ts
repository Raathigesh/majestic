import { observable, computed, action } from 'mobx';
import remoteInterface from './remote';
import { runCompleteStream$ } from './relay';
import Node from './Node';
import It from './It';
import RunnerMachine from './RunnerStatus';

type RunStatus = 'stopped' | 'running' | 'watching';
type RunAction = 'run' | 'watch' | 'stop' | 'complete';

export class Workspace {
  @observable public watch: boolean = false;
  @observable public bookmarks: Map<string, null> = new Map([]);
  @observable public currentExecutingFile: string = '';
  @observable public diableCoverage: boolean = true;
  @observable
  private runStatus: RunStatus = RunnerMachine.initialState.value as RunStatus;

  constructor() {
    runCompleteStream$.subscribe(() => {
      this.setRunStatus('complete');
    });
  }

  public async run() {
    this.currentExecutingFile = '';

    const remote = await remoteInterface;
    if (this.isExecuting) {
      remote.stop();
      return this.setRunStatus('stop');
    }

    remote.run(this.watch, this.diableCoverage);
    this.setRunStatus(this.watch ? 'watch' : 'run');
  }

  public async runFile(node?: Node) {
    if (!node) {
      return;
    }

    this.currentExecutingFile = node.path;

    const remote = await remoteInterface;
    node.execute();
    if (this.isExecuting) {
      remote.filterFileInWatch(node.path);
    } else {
      remote.run(this.watch, this.diableCoverage, node.path);
      this.setRunStatus(this.watch ? 'watch' : 'run');
    }
  }

  public async runTest(node: Node, test: It) {
    const remote = await remoteInterface;
    test.startExecting();
    if (this.isExecuting) {
      remote.filterTestInWatch(node.path, test.name);
    } else {
      remote.run(this.watch, this.diableCoverage, node.path, test.name);
      this.setRunStatus(this.watch ? 'watch' : 'run');
    }
  }

  @action.bound
  public async updateSnapshot(test: It, node: Node) {
    const remote = await remoteInterface;
    const updateStatus = remote.updateSnapshot(node.path, test.name);
    test.updateSnapshot(updateStatus);
  }

  public toggleWatch() {
    this.watch = !this.watch;
  }

  public toggleCoverage() {
    this.diableCoverage = !this.diableCoverage;
  }

  public setRunStatus(nextAction: RunAction) {
    this.runStatus = RunnerMachine.transition(this.runStatus, nextAction)
      .value as RunStatus;
  }

  @computed
  public get isExecuting() {
    return this.runStatus === 'watching' || this.runStatus === 'running';
  }

  public toggleBookmark(path: string) {
    if (this.bookmarks.has(path)) {
      this.bookmarks.delete(path);
    } else {
      this.bookmarks.set(path, null);
    }
  }
}

export default new Workspace();
