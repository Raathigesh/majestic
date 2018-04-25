import { ITreeNode, IconName } from '@blueprintjs/core';
import { observable, IObservableArray, computed } from 'mobx';
import It from './It';
import TreeNodeType from '../../../types/nodeTypes';
import CoverageSummary from './CoverageSummary';
import { FileNode } from '../../engine/types/FileNode';
import { ItBlock } from '../../engine/types/ItBlock';
import { Status } from './types/JestRepoter';
import { getLabel } from '../components/statusLabel';

export default class Node implements ITreeNode {
  @observable childNodes?: Node[];
  @observable hasCaret?: boolean;
  @observable icon?: IconName | JSX.Element;
  @observable id: string | number;
  @observable isExpanded?: boolean = true;
  @observable isSelected?: boolean = false;
  @observable label: string | JSX.Element;
  @observable secondaryLabel?: string | JSX.Element = '';
  @observable className?: string;
  @observable path: string;
  @observable output: string;
  @observable itBlocks: IObservableArray<It> = observable([]);
  @observable type: TreeNodeType;
  @observable content: string;
  @observable coverage = new CoverageSummary();
  @observable executionTime: number = 0;
  @observable status: Status = 'pending';

  public static convertToNode(
    { path, type, label, children, itBlocks }: FileNode,
    flatNodeMap: Map<string, Node> = new Map(),
    parent?: Node
  ) {
    const node = new Node(path, type, label, itBlocks || []);
    flatNodeMap.set(path.toLowerCase(), node);

    if (!children) {
      return {
        node,
        flatNodeMap
      };
    }

    node.childNodes = children.map(
      child => Node.convertToNode(child, flatNodeMap, node).node
    );

    return {
      node,
      flatNodeMap
    };
  }

  constructor(
    path: string,
    type: 'directory' | 'file',
    label: string,
    itBlocks: ItBlock[]
  ) {
    this.path = path;
    this.type = type;
    this.label = label;

    for (const {
      name,
      start: { line }
    } of itBlocks) {
      this.itBlocks.push(new It(name, line));
    }

    if (type === 'directory') {
      this.icon = 'folder-open';
    } else {
      this.icon = 'document';
    }
  }

  public toggleSelection(selection: boolean = true) {
    this.isSelected = selection;
  }

  public getItBlockByTitle(title: string) {
    return this.itBlocks.find(it => it.name === title);
  }

  public executeAllItBlocks() {
    for (const it of this.itBlocks) {
      it.startExecting();
    }
  }

  public execute() {
    this.executeAllItBlocks();
  }

  @computed
  public get totalTests() {
    return this.itBlocks.length;
  }

  @computed
  public get totalPassedTests() {
    return this.itBlocks.filter(e => e.status === 'passed').length;
  }

  @computed
  public get totalFailedTests() {
    return this.itBlocks.filter(e => e.status === 'failed').length;
  }

  @computed
  public get totalSkippedTests() {
    return this.itBlocks.filter(e => e.status === 'skipped').length;
  }

  public setItBlocks(itBlocks: ItBlock[]) {
    this.itBlocks.clear();
    for (const {
      name,
      start: { line }
    } of itBlocks) {
      this.itBlocks.push(new It(name, line));
    }
  }

  public resetStatus() {
    this.itBlocks.map(it => it.resetStatus());
    this.setStatus();
  }

  public setStatus() {
    const isFailed = this.itBlocks.some(it => it.status === 'failed');
    const allPending = this.itBlocks.every(it => it.status === 'pending');
    const allPassed = this.itBlocks.every(
      it => it.status === 'passed' || it.status === 'pending'
    );

    if (isFailed) {
      this.status = 'failed';
    } else if (allPassed && !allPending) {
      this.status = 'passed';
    } else {
      this.status = 'pending';
    }
    this.secondaryLabel = this.type === 'file' ? getLabel(this.status) : '';
  }
}
