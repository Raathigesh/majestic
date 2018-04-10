import { observable, computed, action } from 'mobx';
import register from '../../portal/client';
import { FileNode } from '../../engine/types/FileNode';
import Tests from './Tests';
import Node from './Node';
import It from './It';
import Searcher from './Searcher';
import RunnerMachine from './RunnerStatus';

type RunStatus = 'stopped' | 'running' | 'watching';
type RunAction = 'run' | 'watch' | 'stop' | 'complete';

export default class Workspace {
  @observable public watch: boolean = false;
  @observable public tests: Tests;
  @observable public searcher: Searcher;
  @observable
  private runStatus: RunStatus = RunnerMachine.initialState.value as RunStatus;
  private remoteReady: Promise<any>;

  constructor() {
    this.tests = new Tests(this);
    this.searcher = new Searcher(this);

    this.remoteReady = new Promise(resolve => {
      register('ui', {}, (remote: any) => {
        resolve(remote);
      });
    });

    this.SubscribeToTestFiles();
  }

  public run() {
    this.remoteReady.then((remote: any) => {
      if (this.isExecuting) {
        remote.stop();
        return this.setRunStatus('stop');
      }

      remote.run(this.watch);
      this.setRunStatus(this.watch ? 'watch' : 'run');
    });
  }

  public runFile(node?: Node) {
    if (!node) {
      return;
    }

    this.remoteReady.then((remote: any) => {
      node.executeAll();
      if (this.isExecuting) {
        remote.filterFileInWatch(node.path);
      } else {
        remote.run(this.watch, node.path);
        this.setRunStatus(this.watch ? 'watch' : 'run');
      }
    });
  }

  public runTest(node: Node, test: It) {
    this.remoteReady.then((remote: any) => {
      test.startExecting();
      if (this.isExecuting) {
        remote.filterTestInWatch(node.path, test.name);
      } else {
        remote.run(this.watch, node.path, test.name);
        this.setRunStatus(this.watch ? 'watch' : 'run');
      }
    });
  }

  @action.bound
  public updateSnapshot(test: It, node: Node) {
    this.remoteReady.then(remote => {
      const updateStatus = remote.updateSnapshot(node.path, test.name);
      test.updateSnapshot(updateStatus);
    });
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

  private SubscribeToTestFiles() {
    this.remoteReady.then((remote: any) => {
      remote
        .getFiles()
        .then((files: FileNode[]) => this.tests.initialize(files));
    });
  }
}
