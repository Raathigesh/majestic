import { observable, IObservableArray } from 'mobx';
import Node from './Node';
import { FileNode } from '../../engine/types/FileNode';
import TestResultProcessor from './TestResultProccessor';
import ExecutionSummary from './ExecutionSummary';
import Workspace from './Workspace';

export default class Tests {
  @observable nodes: IObservableArray<Node> = observable([]);
  @observable selectedTest?: Node;
  @observable executionSummary: ExecutionSummary = new ExecutionSummary();
  workspace: Workspace;
  resultProcessor: TestResultProcessor;
  flatNodeMap: Map<string, Node> = new Map();

  constructor(workspace: Workspace) {
    this.workspace = workspace;
    this.resultProcessor = new TestResultProcessor(this.workspace, this);
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
}
