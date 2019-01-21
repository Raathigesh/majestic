export type TestFileStatus = "IDLE" | "EXECUTING";

export default class Results {
  private results: {
    [path: string]: {
      status: TestFileStatus;
      report?: any;
    };
  };

  constructor() {
    this.results = {};
  }

  public setTestStart(path: string) {
    this.setDefaultStatus(path);
    const resultforPath = this.results[path];
    resultforPath.status = "EXECUTING";
  }

  public setTestReport(path: string, report: any) {
    this.setDefaultStatus(path);
    const resultforPath = this.results[path];
    resultforPath.status = "IDLE";
    resultforPath.report = report;
  }

  public getResult(path: string) {
    return this.results[path] || null;
  }

  private setDefaultStatus(path: string) {
    if (!this.results[path]) {
      this.results[path] = {
        status: "IDLE"
      };
    }
  }
}
