import { observable, IObservableArray, computed, action } from 'mobx';
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
import { TestResult, Test, AggregatedResult } from './types/JestRepoter';
import CoverageSummary from './CoverageSummary';

export class Tests {
  @observable nodes: IObservableArray<Node> = observable([]);
  @observable selectedTest?: Node;
  @observable executionSummary: ExecutionSummary = new ExecutionSummary();
  @observable coverageSummary: CoverageSummary = new CoverageSummary();
  @observable flatNodeMap: Map<string, Node> = new Map();

  constructor() {
    fileChangeStream$.subscribe(({ file, itBlocks }) => {
      const node = this.getByPath(file);
      if (node) {
        node.setItBlocks(itBlocks);
        node.setStatus();
      }
    });

    fileAddStream$.subscribe(({ files, path }) => {
      this.initialize(files);
      this.changeCurrentSelection(path);
    });

    fileDeleteStream$.subscribe(({ files, path }) => {
      const toBeDeleted: Node | undefined = this.flatNodeMap.get(
        path.toLocaleLowerCase()
      );
      if (toBeDeleted) {
        const parent = toBeDeleted.parent;

        if (parent && parent.children) {
          (parent.children as IObservableArray).remove(toBeDeleted);
        }
      }
    });

    testResultStream$.subscribe(({ test, testResult, aggregatedResult }) => {
      this.handleOnTestResult(test, testResult, aggregatedResult);
    });

    runCompleteStream$.subscribe(({ results }) => {
      this.handleOnRunComplete(results);
    });

    this.readFiles();
  }

  public initialize(files: FileNode[]) {
    this.nodes.clear();
    this.flatNodeMap.clear();
    for (const file of files) {
      const node = Node.convertToNode(file, this.flatNodeMap).node;
      node.isExpanded = true;
      this.nodes.push(node);
    }
  }

  public getByPath(path: string) {
    return this.flatNodeMap.get(path.toLowerCase());
  }

  @action.bound
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

  @action.bound
  public collapseTests() {
    (this.nodes[0].children || []).forEach(child => (child.isExpanded = false));
  }

  public resetStatus() {
    this.flatNodeMap.forEach(node => node.resetStatus());
  }

  @computed
  public get failedTests() {
    return Array.from(this.flatNodeMap)
      .filter(([key, file]) => file.status === 'failed')
      .map(([key, file]) => file);
  }

  public executeAllItBlocks() {
    this.flatNodeMap.forEach(file => file.execute());
  }

  public async reFetchFiles() {
    const remote = await remoteInterface;
    const files: FileNode[] = await remote.reFetchFiles();
    this.initialize(files);
  }

  private async readFiles() {
    const remote = await remoteInterface;
    const files: FileNode[] = await remote.getFiles();
    this.initialize(files);
  }

  private handleOnTestResult(
    test: Test,
    testResult: TestResult,
    aggregatedResult: AggregatedResult
  ) {
    console.log(testResult);
    const testNode = this.getByPath(test.path);
    if (!testNode) {
      return;
    }

    testNode.executionTime = test.duration || 0;

    for (const assertionResult of testResult.testResults) {
      const itBlock = testNode.getItBlockByTitle(assertionResult.title.trim());

      if (!itBlock) {
        return;
      }
      itBlock.setTimeTaken(assertionResult.duration || 0);
      itBlock.status = assertionResult.status;
      itBlock.failureMessage = assertionResult.failureMessages[0];
      itBlock.stopExecuting();
    }

    testNode.setStatus();

    this.setAggregatedResults(aggregatedResult);
  }

  private handleOnRunComplete(results: AggregatedResult) {
    this.setAggregatedResults(results);
  }

  private setAggregatedResults(results: AggregatedResult) {
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

    if (results.coverageMap) {
      this.coverageSummary.mapCoverage(results.coverageMap);
    }
  }
}

export default new Tests();
