import { observable } from 'mobx';
import { Status } from './types/JestRepoter';

export default class It {
  @observable public name: string;
  @observable public status: Status;
  @observable public failureMessage: string;
  @observable public executing: boolean = false;
  @observable public timeTaken: number = 0;

  constructor(name: string) {
    this.name = name;
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
}
