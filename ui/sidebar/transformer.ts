import { Item } from "../../server/api/workspace/tree";

export interface TreeNode extends Item {
  name: string;
  path: string;
  isCollapsed: boolean;
  haveFailure: boolean;
  passing: boolean;
  isExecuting: boolean;
  hierarchy: number;
}

export function transform(
  item: TreeNode,
  executingTests: string[],
  failedFiles: string[],
  passingTests: string[],
  collpsedFiles: { [path: string]: boolean },
  showOnlyFailure: boolean,
  items: Item[],
  results: TreeNode[] = [],
  hierarchy = 0
) {
  const isCollapsed = collpsedFiles[item.path];
  const haveFailure = failedFiles.indexOf(item.path) > -1;
  const nextChildren = getChildren(item.path, items);

  const includeInfailure = shouldBeIncludedInFailureTree(
    nextChildren,
    failedFiles
  );

  const treeItem = {
    type: item.type,
    name: item.name,
    path: item.path,
    hierarchy: hierarchy,
    isCollapsed: collpsedFiles[item.path],
    passing: passingTests.indexOf(item.path) > -1,
    haveFailure,
    isExecuting: executingTests.indexOf(item.path) > -1
  };

  if (item.type === "directory") {
    if (showOnlyFailure) {
      if (includeInfailure) {
        results.push(treeItem);
      }
    } else {
      results.push(treeItem);
    }
  } else {
    if (showOnlyFailure && haveFailure) {
      results.push(treeItem);
    }

    if (showOnlyFailure === false) {
      results.push(treeItem);
    }
  }

  if (!isCollapsed) {
    nextChildren.forEach(item => {
      transform(
        item as any,
        executingTests,
        failedFiles,
        passingTests,
        collpsedFiles,
        showOnlyFailure,
        items,
        results,
        hierarchy + 1
      );
    });
  }

  return results;
}

function getChildren(path: string, files: Item[]) {
  return files.filter(file => file.parent === path);
}

function shouldBeIncludedInFailureTree(files: Item[], failedTests: string[]) {
  return (
    files.some(file => failedTests.includes(file.path)) ||
    files.some(file => file.type === "directory")
  );
}
