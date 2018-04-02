import { observable, IObservableArray } from 'mobx';
import Node from './Node';
import { FileNode } from '../../engine/types/FileNode';
import TestResultProcessor from './TestResultProccessor';
import ExecutionSummary from './ExecutionSummary';

export default class Tests {
  @observable nodes: IObservableArray<Node> = observable([]);
  @observable selectedTest?: Node;
  resultProcessor: TestResultProcessor = new TestResultProcessor(this);
  flatNodeMap: Map<string, Node> = new Map();
  @observable executionSummary: ExecutionSummary = new ExecutionSummary();

  initialize(files: FileNode[]) {
    for (const file of files) {
      this.nodes.push(Node.convertToNode(file, this.flatNodeMap).node);
    }
  }

  getByPath(path: string) {
    return this.flatNodeMap.get(path);
  }

  changeCurrentSelection(path: string) {
    // if there is a previous selection, unselect it
    if (this.selectedTest) {
      this.selectedTest.toggleSelection(false);
    }

    this.selectedTest = this.flatNodeMap.get(path);
    if (this.selectedTest) {
      this.selectedTest.toggleSelection();
    }
  }
}
