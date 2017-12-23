import { ITreeNode, IconName } from "@blueprintjs/core";
import { observable, action, IObservableArray } from "mobx";
import ItBlockWithStatus from "../types/it-block";
import TreeNodeType from "../types/node-type";
import {
  TestReconcilationState,
  parse as parseJavaScript
} from "jest-editor-support";
import { parse as parseTypeScript } from "jest-test-typescript-parser";
import { readFile } from "fs";
import CoverageSummary from "./CoverageSummary";
import { FileExecutingIcon } from "../constants/ui";
import { Icons } from "../util/constants";

class TreeNode implements ITreeNode {
  @observable childNodes?: ITreeNode[];
  @observable hasCaret?: boolean;
  @observable iconName?: IconName;
  @observable id: string | number;
  @observable isExpanded?: boolean;
  @observable isSelected?: boolean = false;
  @observable label: string | JSX.Element;
  @observable secondaryLabel?: string | JSX.Element = "";
  @observable className?: string;
  @observable path: string;
  @observable status: TestReconcilationState;
  @observable output: string;
  @observable itBlocks: IObservableArray<ItBlockWithStatus> = observable([]);
  @observable type: TreeNodeType;
  @observable isTest: boolean;
  @observable content: string;
  @observable coverage = new CoverageSummary();
  parent: TreeNode;

  @action
  setToFileIcon() {
    this.secondaryLabel = "";
    this.iconName = Icons.FileIcon;
    this.className = "";
  }

  @action
  spin() {
    this.className = "spin";
    this.iconName = FileExecutingIcon;
  }

  @action
  toggleAllTests() {
    this.itBlocks.forEach(it => {
      it.isExecuting = true;
      it.snapshotErrorStatus = "";
    });
  }

  @action
  highlight() {
    this.isSelected = true;
    this.expandNode(this);
  }

  @action
  unhighlight() {
    this.isSelected = false;
  }

  @action
  expandNode(node: TreeNode) {
    if (node !== null) {
      node.isExpanded = true;

      this.expandNode(node.parent);
    }
  }

  @action
  readContent() {
    readFile(this.path, (err, data) => {
      this.content = data.toString();
    });
  }

  getParser() {
    const isTypeScript = this.path.match(/\.tsx?$/);
    return isTypeScript ? parseTypeScript : parseJavaScript;
  }

  @action
  parseItBlocks(shouldExecute = false) {
    let itBlocks: ItBlockWithStatus[] = [];
    let itBlocksJs: ItBlockWithStatus[] = [];

    const parser = this.getParser();

    if (this.type === "file" && this.isTest) {
      itBlocks = parser(this.path).itBlocks.map(block => {
        itBlocksJs.push({
          ...block,
          isExecuting: shouldExecute,
          filePath: this.path
        });

        const it = new ItBlockWithStatus();
        it.name = block.name;
        it.isExecuting = shouldExecute;
        it.filePath = this.path;
        it.lineNumber = block.start.line;
        return it;
      });
    }

    this.itBlocks.clear();
    this.itBlocks.push(...itBlocks);

    return itBlocksJs;
  }

  @action
  highlightItBlocks(name: string) {
    this.itBlocks.forEach(it => {
      if (it.name === name) {
        it.active = true;
      }
    });
  }
}

export default TreeNode;
