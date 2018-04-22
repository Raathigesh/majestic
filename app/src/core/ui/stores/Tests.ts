import { observable, IObservableArray } from 'mobx';
import Node from './Node';
import { FileNode } from '../../engine/types/FileNode';
import ExecutionSummary from './ExecutionSummary';
import {
  default as remoteInterface,
  fileChangeStream$,
  fileAddStream$,
  fileDeleteStream$
} from './remote';
import { testResultStream$, runCompleteStream$ } from './relay';
import {
  TestResult,
  Test,
  AggregatedResultWithoutCoverage
} from './types/JestRepoter';

export class Tests {
  @observable nodes: IObservableArray<Node> = observable([]);
  @observable selectedTest?: Node;
  @observable executionSummary: ExecutionSummary = new ExecutionSummary();
  flatNodeMap: Map<string, Node> = new Map();

  constructor() {
    fileChangeStream$.subscribe(({ file, itBlocks }) => {
      const node = this.getByPath(file);
      if (node) {
        node.setItBlocks(itBlocks);
      }
    });

    fileAddStream$.subscribe(({ files, path }) => {
      this.initialize(files);
      this.changeCurrentSelection(path);
    });

    fileDeleteStream$.subscribe(({ files, path }) => {
      this.initialize(files);
      this.changeCurrentSelection(path);
    });

    testResultStream$.subscribe(({ test, testResult }) => {
      this.handleOnTestResult(test, testResult);
    });

    runCompleteStream$.subscribe(({ results }) => {
      this.handleOnRunComplete(results);
    });

    this.SubscribeToTestFiles();
  }

  public initialize(files: FileNode[]) {
    this.nodes.clear();
    this.flatNodeMap.clear();
    for (const file of files) {
      this.nodes.push(Node.convertToNode(file, this.flatNodeMap).node);
    }
  }

  public getByPath(path: string) {
    return this.flatNodeMap.get(path.toLowerCase());
  }

  public changeCurrentSelection(path: string) {
    const nextSelection = this.flatNodeMap.get(path.toLowerCase());
    if (nextSelection) {
      // if there is a previous selection, unselect it
      if (this.selectedTest) {
        this.selectedTest.toggleSelection(false);
      }

      this.selectedTest = nextSelection;
      this.selectedTest.toggleSelection();
    }
  }

  private handleOnTestResult(test: Test, testResult: TestResult) {
    console.log(testResult);
    const testNode = this.getByPath(test.path);
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
    this.executionSummary.updateSuitSummary(
      results.numPassedTestSuites,
      results.numFailedTestSuites
    );

    this.executionSummary.updateTestSummary(
      results.numPassedTests,
      results.numFailedTests
    );

    this.executionSummary.updateSnapshotSummary(
      results.snapshot.matched,
      results.snapshot.unmatched
    );

    this.executionSummary.updateTimeTaken(results.startTime);
  }

  private async SubscribeToTestFiles() {
    const remote = await remoteInterface;
    const files: FileNode[] = await remote.getFiles();
    this.initialize(files);
  }
}

export default new Tests();
