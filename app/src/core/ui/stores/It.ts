import { observable, computed } from 'mobx';
import { Status } from './types/JestRepoter';

export default class It {
  @observable public name: string;
  @observable public status: Status;
  @observable public failureMessage: string = '';
  @observable public executing: boolean = false;
  @observable public timeTaken: number;
  @observable public updatingSnapshot: boolean = false;
  public line: number;

  constructor(name: string, line: number) {
    this.name = name;
    this.line = line;
  }

  startExecting() {
    this.executing = true;
  }

  stopExecuting() {
    this.executing = false;
  }

  setTimeTaken(timeTaken: number) {
    this.timeTaken = timeTaken;
  }

  resetStatus() {
    this.status = '';
    this.startExecting();
  }

  public async updateSnapshot(promise: Promise<any>) {
    this.updatingSnapshot = true;
    await promise;
    this.updatingSnapshot = false;
    this.failureMessage = '';
    this.status = 'passed';
  }

  @computed
  public get isSnapshotFailure() {
    if (!this.failureMessage) {
      return false;
    }
    return this.failureMessage.includes('not match stored snapshot');
  }
}
