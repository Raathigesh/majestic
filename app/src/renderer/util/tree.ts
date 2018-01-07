import { observable } from "mobx";
import { TestReconcilationState } from "jest-editor-support";
import TreeNodeType from "../types/node-type";
import TreeNode from "../stores/TreeNode";
import { Icons } from "./constants";
import { getTestFilePattern } from "./workspace";
import ItBlockWithStatus from "../types/it-block";

let nodes = new Map<string, TreeNode>();
let itBlocks = new Map<string, ItBlockWithStatus[]>();

export function processTests(rootPath, value, allFiles) {
  nodes = new Map<string, TreeNode>();
  itBlocks = new Map<string, ItBlockWithStatus[]>();

  const tests = transform(rootPath, value, allFiles, null);
  return {
    tests,
    nodes,
    itBlocks
  };
}

function transform(rootPath, node, allFiles, parent) {
  const children = observable<TreeNode>([]);
  const matcher = getTestFilePattern(rootPath);

  if (node.children) {
    node.children.forEach(child => {
      const path = child.path;
      let treeNode;

      if (child.type === "file" && !matcher(path)) {
        // if not a test, don't bother
        return;
      }

      if (nodes.get(path) && child.type === "file") {
        treeNode = nodes.get(path);
      } else {
        treeNode = createNode(
          path,
          child,
          child.type,
          rootPath,
          allFiles,
          matcher
        );
      }

      treeNode.parent = parent;

      if (
        child.type !== "file" &&
        treeNode.childNodes &&
        treeNode.childNodes.length > 0
      ) {
        children.push(treeNode);
      } else if (child.type === "file") {
        children.push(treeNode);
      }

      if (child.type === "file" && !nodes.get(path)) {
        nodes.set(path, treeNode);
      }
    });
  }

  return children;
}

function createNode(
  path: string,
  child: any,
  type: TreeNodeType,
  rootPath: string,
  allFiles,
  matcher
) {
  const isTest = matcher(path);
  const node = new TreeNode();
  node.id = path;
  node.hasCaret = child.type === "directory";
  node.iconName = child.type === "file" ? Icons.FileIcon : Icons.FolderIcon;
  node.label = child.name;
  node.isExpanded = false;
  node.childNodes = transform(rootPath, child, allFiles, node);
  node.className = "tree-node-custom";
  node.path = path;
  node.status = "Unknown" as TestReconcilationState;
  node.output = "";
  node.type = type;
  node.isTest = isTest;

  // collect all the it blocks in a map. This is used for quick search
  const its = node.parseItBlocks();
  itBlocks.set(path, its);

  return node;
}
