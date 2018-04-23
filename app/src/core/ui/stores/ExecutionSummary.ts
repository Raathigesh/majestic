import { observable } from 'mobx';
// import * as distanceInWords from 'date-fns/distance_in_words';

export default class ExecutionSummary {
  @observable public successfulSuits: number = 0;
  @observable public failedSuits: number = 0;
  @observable public successfulTests: number = 0;
  @observable public failedTests: number = 0;
  @observable public successfulSnaphots: number = 0;
  @observable public failedSnaphots: number = 0;
  @observable public timeTaken: number = 0;

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

  public updateTimeTaken(startTime: number) {
    this.timeTaken = (Date.now() - startTime) / 1000;
  }
}
