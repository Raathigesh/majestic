import { observable } from "mobx";

export default class WatcherDetails {
  @observable fileName: string;
  @observable testName: string;
}
