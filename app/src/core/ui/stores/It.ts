import { observable } from 'mobx';
import { Status } from './types/JestRepoter';

export default class It {
  @observable public name: string;
  @observable public status: Status;

  constructor(name: string) {
    this.name = name;
  }
}
