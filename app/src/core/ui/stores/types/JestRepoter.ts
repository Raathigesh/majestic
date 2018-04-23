export interface Test {
  duration?: number;
  path: string;
}

export interface Callsite {
  column: number;
  line: number;
}

export type Status = 'passed' | 'failed' | 'skipped' | 'pending';

export interface AssertionResult {
  ancestorTitles: Array<string>;
  duration?: number;
  failureMessages: Array<string>;
  fullName: string;
  location: Callsite;
  numPassingAsserts: number;
  status: Status;
  title: string;
}

export interface TestResult {
  console?: any;
  coverage?: any;
  displayName?: string;
  failureMessage?: string;
  leaks: boolean;
  memoryUsage: any;
  numFailingTests: number;
  numPassingTests: number;
  numPendingTests: number;
  perfStats: {
    end: number;
    start: number;
  };
  skipped: boolean;
  snapshot: {
    added: number;
    fileDeleted: boolean;
    matched: number;
    unchecked: number;
    uncheckedKeys: Array<string>;
    unmatched: number;
    updated: number;
  };
  sourceMaps: any;
  testExecError: any;
  testFilePath: string;
  testResults: Array<AssertionResult>;
}

export interface AggregatedResult {
  numFailedTests: number;
  numFailedTestSuites: number;
  numPassedTests: number;
  numPassedTestSuites: number;
  numPendingTests: number;
  numPendingTestSuites: number;
  numRuntimeErrorTestSuites: number;
  numTotalTests: number;
  numTotalTestSuites: number;
  snapshot: SnapshotSummary;
  startTime: number;
  success: boolean;
  testResults: Array<TestResult>;
  wasInterrupted: boolean;
  coverageMap?: any;
}

export interface SnapshotSummary {
  added: number;
  didUpdate: boolean;
  failure: boolean;
  filesAdded: number;
  filesRemoved: number;
  filesUnmatched: number;
  filesUpdated: number;
  matched: number;
  total: number;
  unchecked: number;
  uncheckedKeys: Array<string>;
  unmatched: number;
  updated: number;
}
