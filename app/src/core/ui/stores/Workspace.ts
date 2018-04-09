import { observable, computed, action } from 'mobx';
import register from '../../portal/client';
import { FileNode } from '../../engine/types/FileNode';
import Tests from './Tests';
import Node from './Node';
import It from './It';
import Searcher from './Searcher';

type RunStatus = 'idle' | 'started' | 'run-complete';

export default class Workspace {
  @observable public watching: boolean = false;
  @observable public tests: Tests;
  @observable public searcher: Searcher;
  @observable private runStatus: RunStatus = 'idle';
  private remoteReady: Promise<any>;

  constructor() {
    this.tests = new Tests();
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
        return this.setRunStatus('idle');
      }

      remote.run(this.watching);
      return this.setRunStatus('started');
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
        remote.run(this.watching, node.path);
      }
    });
  }

  public runTest(node: Node, test: It) {
    this.remoteReady.then((remote: any) => {
      test.startExecting();
      if (this.isExecuting) {
        remote.filterTestInWatch(node.path, test.name);
      } else {
        remote.run(this.watching, node.path, test.name);
        this.setRunStatus('started');
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
    this.watching = !this.watching;
  }

  public setRunStatus(status: RunStatus) {
    if (status === 'run-complete') {
      // if the status is run-complete, the test processor is trying to indicate the
      // run is complete. But if the watch mode is on, the runner is still running.
      if (!this.watching) {
        this.runStatus = 'idle';
      }
    }

    this.runStatus = status;
  }

  @computed
  public get isExecuting() {
    return this.watching && this.runStatus === 'started';
  }

  private SubscribeToTestFiles() {
    this.remoteReady.then((remote: any) => {
      remote
        .getFiles()
        .then((files: FileNode[]) => this.tests.initialize(files));
    });
  }
}
