import { observable } from "mobx";
import {
  parse as babylonParse,
  TestReconcilationState
} from "jest-editor-support";
import TreeNodeType from "../types/node-type";
import TreeNode from "../stores/TreeNode";
import { SnapshotErrorStatus } from "../types/it-block";
import { getTestFilePattern } from "./workspace";
import { Icons } from "./constants";
const mm = require("micromatch");

let nodes = new Map<string, TreeNode>();

export function processTests(rootPath, value, allFiles) {
  nodes = new Map<string, TreeNode>();
  const tests = tranform(rootPath, value, allFiles);
  const files = tranform(rootPath, value, allFiles);
  return {
    tests,
    files,
    nodes
  };
}

function testFileMatcher(rootPath: string) {
  const globs = getTestFilePattern(rootPath);
  const matchers = globs.map(each => mm.matcher(each, { dot: true }));
  return path => matchers.some(each => each(path));
}

function tranform(rootPath, node, allFiles, tree = []) {
  const children = observable<TreeNode>([]);

  node.children &&
    node.children.forEach(child => {
      const path = child.path;
      let node;
      if (nodes.get(path) && child.type === "file") {
        node = nodes.get(path);
      } else {
        node = createNode(path, child, tree, child.type, rootPath, allFiles);
      }

      if (
        child.type !== "file" &&
        node.childNodes &&
        node.childNodes.length > 0
      ) {
        children.push(node);
      } else if (child.type === "file") {
        children.push(node);
      }

      if (child.type === "file" && !nodes.get(path)) {
        nodes.set(path, node);
      }
    });

  return children;
}

function createNode(
  path: string,
  child: any,
  tree,
  type: TreeNodeType,
  rootPath: string,
  allFiles
) {
  const testFileMatch = testFileMatcher(rootPath);
  const isTest = testFileMatch(path);
  const node = new TreeNode();
  node.id = path;
  node.hasCaret = child.type === "directory";
  node.iconName = child.type === "file" ? Icons.FileIcon : Icons.FolderIcon;
  node.label = child.name;
  node.isExpanded = true;
  node.childNodes = tranform(rootPath, child, allFiles, tree);
  node.className = "";
  node.path = path;
  node.status = "Unknown" as TestReconcilationState;
  node.output = "";
  node.type = type;
  node.isTest = isTest;
  node.parseItBlocks();
  return node;
}
