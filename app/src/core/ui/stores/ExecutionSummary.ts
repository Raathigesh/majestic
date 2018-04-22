import { observable, computed } from 'mobx';

export default class ExecutionSummary {
  @observable public successfulSuits: number = 0;
  @observable public failedSuits: number = 0;
  @observable public successfulTests: number = 0;
  @observable public failedTests: number = 0;
  @observable public successfulSnaphots: number = 0;
  @observable public failedSnaphots: number = 0;
  @observable public startTime: Date = new Date();

  public updateSuitSummary(success: number, failures: number) {
    this.successfulSuits = success;
    this.failedSuits = failures;
  }

  public updateTestSummary(success: number, failures: number) {
    this.successfulTests = success;
    this.failedTests = failures;
  }

  public updateSnapshotSummary(success: number, failures: number) {
    this.successfulSnaphots = success;
    this.failedSnaphots = failures;
  }

  public updateTimeTaken(start: number) {
    this.startTime = new Date(0);
    this.startTime.setUTCSeconds(start);
  }

  @computed
  public get timeTaken() {
    return new Date().getSeconds() - this.startTime.getSeconds();
  }
}
