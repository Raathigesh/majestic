import Tests from './Tests';
import {
  Test,
  TestResult,
  AggregatedResultWithoutCoverage
} from './types/JestRepoter';
import Workspace from './Workspace';
const Sockette = require('sockette');

export default class TestResultProcessor {
  private workspace: Workspace;
  private testFiles: Tests;

  constructor(workspace: Workspace, testFiles: Tests) {
    this.testFiles = testFiles;
    this.workspace = workspace;

    const ws = new Sockette.default('ws://localhost:7777', {
      timeout: 5e3,
      maxAttempts: 10,
      onmessage: (e: any) => {
        const { event, payload } = JSON.parse(e.data);
        if (event === 'onTestResult') {
          this.handleOnTestResult(payload.test, payload.testResult);
        } else if (event === 'onRunComplete') {
          this.handleOnRunComplete(payload.results);
        }
      },
      onopen: () => {
        ws.send('send');
      }
    });
  }

  private handleOnTestResult(test: Test, testResult: TestResult) {
    console.log(testResult);
    const testNode = this.testFiles.getByPath(test.path);
    if (!testNode) {
      return;
    }

    testNode.executionTime = test.duration || 0;

    for (const assertionResult of testResult.testResults) {
      const itBlock = testNode.getItBlockByTitle(assertionResult.title);

      if (!itBlock) {
        return;
      }
      itBlock.setTimeTaken(assertionResult.duration || 0);
      itBlock.status = assertionResult.status;
      itBlock.failureMessage = assertionResult.failureMessages[0];
      itBlock.stopExecuting();
    }

    testNode.setStatus();
  }

  private handleOnRunComplete(results: AggregatedResultWithoutCoverage) {
    this.testFiles.executionSummary.updateSuitSummary(
      results.numPassedTestSuites,
      results.numFailedTestSuites
    );

    this.testFiles.executionSummary.updateTestSummary(
      results.numPassedTests,
      results.numFailedTests
    );

    this.testFiles.executionSummary.updateSnapshotSummary(
      results.snapshot.matched,
      results.snapshot.unmatched
    );

    this.workspace.setRunStatus('complete');
  }
}
