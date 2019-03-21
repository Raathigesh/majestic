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
  showFailedTests: boolean,
  items: Item[],
  results: TreeNode[] = [],
  hierarchy = 0
) {
  const isCollapsed = collpsedFiles[item.path] && !showFailedTests; // when showing failed tests, keep all expanded
  const haveFailure = failedFiles.indexOf(item.path) > -1;
  const nextChildren = getChildren(item.path, items);

  const treeItem = {
    type: item.type,
    name: item.name,
    path: item.path,
    parent: item.parent,
    hierarchy: hierarchy,
    isCollapsed: isCollapsed,
    passing: passingTests.indexOf(item.path) > -1,
    haveFailure,
    isExecuting: executingTests.indexOf(item.path) > -1
  };

  results.push(treeItem);

  if (!isCollapsed) {
    nextChildren.forEach(item => {
      transform(
        item as any,
        executingTests,
        failedFiles,
        passingTests,
        collpsedFiles,
        showFailedTests,
        items,
        results,
        hierarchy + 1
      );
    });
  }

  return results;
}

export const filterFailure = (results: TreeNode[]) => {
  const finalResults = [];
  for (let i = results.length - 1; i >= 0; i--) {
    const item = results[i];
    if (item.type === "file" && item.haveFailure === true) {
      finalResults.push(item);
    } else if (item.type === "directory") {
      const hasFailedChilren = haveFailedChildren(item.path, finalResults);
      if (hasFailedChilren) {
        finalResults.push(item);
      }
    }
  }
  return finalResults.reverse();
};

function haveFailedChildren(path: string, results: TreeNode[]) {
  return (
    results.filter(
      result =>
        result.parent === path &&
        (result.haveFailure === true || result.type === "directory")
    ).length > 0
  );
}

function getChildren(path: string, files: Item[]) {
  return files.filter(file => file.parent === path);
}
