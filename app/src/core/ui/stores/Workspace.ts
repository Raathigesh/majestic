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
  @observable
  private runStatus: RunStatus = RunnerMachine.initialState.value as RunStatus;

  constructor() {
    runCompleteStream$.subscribe(() => {
      this.setRunStatus('complete');
    });
  }

  public async run() {
    const remote = await remoteInterface;
    if (this.isExecuting) {
      remote.stop();
      return this.setRunStatus('stop');
    }

    remote.run(this.watch);
    this.setRunStatus(this.watch ? 'watch' : 'run');
  }

  public async runFile(node?: Node) {
    if (!node) {
      return;
    }

    const remote = await remoteInterface;
    node.executeAll();
    if (this.isExecuting) {
      remote.filterFileInWatch(node.path);
    } else {
      remote.run(this.watch, node.path);
      this.setRunStatus(this.watch ? 'watch' : 'run');
    }
  }

  public async runTest(node: Node, test: It) {
    const remote = await remoteInterface;
    test.startExecting();
    if (this.isExecuting) {
      remote.filterTestInWatch(node.path, test.name);
    } else {
      remote.run(this.watch, node.path, test.name);
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

  public setRunStatus(nextAction: RunAction) {
    this.runStatus = RunnerMachine.transition(this.runStatus, nextAction)
      .value as RunStatus;
  }

  @computed
  public get isExecuting() {
    return this.runStatus === 'watching' || this.runStatus === 'running';
  }
}

export default new Workspace();
