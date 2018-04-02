import { observable } from 'mobx';
import register from '../../portal/client';
import { FileNode } from '../../engine/types/FileNode';
import Tests from './Tests';

export default class Workspace {
  @observable tests: Tests;
  remoteReady: Promise<any>;

  constructor() {
    this.tests = new Tests();

    this.remoteReady = new Promise(resolve => {
      register('ui', {}, (remote: any) => {
        resolve(remote);
      });
    });

    this.SubscribeToTestFiles();
  }

  public run() {
    this.remoteReady.then((remote: any) => {
      remote.run();
    });
  }

  private SubscribeToTestFiles() {
    this.remoteReady.then((remote: any) => {
      remote
        .getFiles()
        .then((files: FileNode[]) => this.tests.initialize(files));
    });
  }
}
