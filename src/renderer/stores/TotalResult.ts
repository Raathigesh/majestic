import { observable } from "mobx";

export class TotalResult {
  @observable numPassedTestSuites: number;
  @observable numFailedTestSuites: number;
  @observable numPassedTests: number;
  @observable numFailedTests: number;
  @observable matchedSnaphots: number;
  @observable unmatchedSnapshots: number;
}
