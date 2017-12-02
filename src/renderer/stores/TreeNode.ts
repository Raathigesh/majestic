import { ITreeNode, IconName } from "@blueprintjs/core";
import { observable, action, IObservableArray } from "mobx";
import ItBlockWithStatus from "../types/it-block";
import TreeNodeType from "../types/node-type";
import { TestReconcilationState } from "jest-editor-support";
import { readFile } from "fs";
import CoverageSummary from "./CoverageSummary";

class TreeNode implements ITreeNode {
  @observable childNodes?: ITreeNode[];
  @observable hasCaret?: boolean;
  @observable iconName?: IconName;
  @observable id: string | number;
  @observable isExpanded?: boolean;
  @observable isSelected?: boolean = false;
  @observable label: string | JSX.Element;
  @observable secondaryLabel?: string | JSX.Element;
  @observable className?: string;
  @observable path: string;
  @observable status: TestReconcilationState;
  @observable output: string;
  @observable itBlocks: IObservableArray<ItBlockWithStatus> = observable([]);
  @observable type: TreeNodeType;
  @observable isTest: boolean;
  @observable content: string;
  @observable coverage = new CoverageSummary();

  @action
  toggleCurrent() {
    this.className = "spin";
    this.iconName = "pt-icon-locate";
  }

  @action
  toggleAllTests() {
    this.itBlocks.forEach(it => {
      it.isExecuting = true;
      it.snapshotErrorStatus = "unknown";
    });
  }

  @action
  highlight() {
    this.isSelected = true;
  }

  @action
  readContent() {
    readFile(this.path, (err, data) => {
      this.content = data.toString();
    });
  }

  @action
  addItBlocks(itBlocks: ItBlockWithStatus[]) {
    this.itBlocks.clear();
    this.itBlocks.push(...itBlocks);
  }
}

export default TreeNode;
