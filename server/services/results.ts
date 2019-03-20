export type TestFileStatus = "IDLE" | "EXECUTING";

export default class Results {
  private results: {
    [path: string]: {
      report?: any;
    };
  } = {};

  private testStatus: {
    [path: string]: {
      isExecuting: boolean;
      containsFailure: boolean;
    };
  } = {};

  private summary: {
    numFailedTests: number;
    numPassedTests: number;
    numPassedTestSuites: number;
    numFailedTestSuites: number;
  };

  constructor() {
    this.results = {};
    this.summary = {
      numFailedTests: 0,
      numPassedTests: 0,
      numPassedTestSuites: 0,
      numFailedTestSuites: 0
    };
  }

  public setTestStart(path: string) {
    if (!this.testStatus[path]) {
      this.testStatus[path] = {
        isExecuting: false,
        containsFailure: false
      };
    }
    this.testStatus[path].isExecuting = true;
  }

  public setTestReport(path: string, report: any) {
    this.results[path] = report;
    this.testStatus[path].isExecuting = false;

    if (report.numFailingTests > 0) {
      this.testStatus[path].containsFailure = true;
    } else {
      this.testStatus[path].containsFailure = false;
    }
  }

  public getResult(path: string) {
    return this.results[path] || null;
  }

  public setSummary(
    passedTests: number,
    failedTests: number,
    numPassedTestSuites: number,
    numFailedTestSuites: number
  ) {
    this.summary = {
      numFailedTests: failedTests,
      numPassedTests: passedTests,
      numPassedTestSuites,
      numFailedTestSuites
    };
  }

  public markExecutingAsStopped() {
    this.testStatus = Object.entries(this.testStatus).reduce(
      (acc, [key, value]) => ({
        [key]: {
          ...value,
          isExecuting: false
        },
        ...acc
      }),
      {}
    );
  }

  public getSummary() {
    return this.summary;
  }

  public getFailedTests() {
    return Object.entries(this.testStatus)
      .filter(([path, status]) => {
        return status.containsFailure;
      })
      .map(([path]) => path);
  }

  public getPassedTests() {
    return Object.entries(this.testStatus)
      .filter(([path, status]) => {
        return !status.containsFailure && !status.isExecuting;
      })
      .map(([path]) => path);
  }

  public getExecutingTests() {
    return Object.entries(this.testStatus)
      .filter(([path, status]) => {
        return status.isExecuting === true;
      })
      .map(([path]) => path);
  }
}
