import { observable } from "mobx";
import { TestReconcilationState } from "jest-editor-support";
import TreeNodeType from "../types/node-type";
import TreeNode from "../stores/TreeNode";
import { Icons } from "./constants";
import { getTestFilePattern } from "./workspace";

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

function tranform(rootPath, node, allFiles, tree = []) {
  const children = observable<TreeNode>([]);
  const matcher = getTestFilePattern(rootPath);

  node.children &&
    node.children.forEach(child => {
      const path = child.path;
      let node;
      if (nodes.get(path) && child.type === "file") {
        node = nodes.get(path);
      } else {
        node = createNode(
          path,
          child,
          tree,
          child.type,
          rootPath,
          allFiles,
          matcher
        );
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
  allFiles,
  matcher
) {
  const isTest = matcher(path);
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
