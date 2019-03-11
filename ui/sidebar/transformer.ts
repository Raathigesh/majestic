import { Item } from "../../server/api/workspace/tree";

export interface TreeNode extends Item {
  name: string;
  path: string;
  isCollapsed: boolean;
  haveFailure: boolean;
  isExecuting: boolean;
  hierarchy: number;
}

export function transform(
  item: TreeNode,
  executingTests: string[],
  failedFiles: string[],
  collpsedFiles: { [path: string]: boolean },
  showOnlyFailure: boolean,
  items: Item[],
  results: TreeNode[] = [],
  hierarchy = 0
) {
  const isCollapsed = collpsedFiles[item.path];
  const haveFailure = failedFiles.indexOf(item.path) > -1;

  if (item.type === "directory") {
    results.push({
      type: item.type,
      name: item.name,
      path: item.path,
      hierarchy: hierarchy,
      isCollapsed: collpsedFiles[item.path],
      haveFailure,
      isExecuting: executingTests.indexOf(item.path) > -1
    });
  } else {
    if (showOnlyFailure && haveFailure) {
      results.push({
        type: item.type,
        name: item.name,
        path: item.path,
        hierarchy: hierarchy,
        isCollapsed: collpsedFiles[item.path],
        haveFailure,
        isExecuting: executingTests.indexOf(item.path) > -1
      });
    }

    if (showOnlyFailure === false) {
      results.push({
        type: item.type,
        name: item.name,
        path: item.path,
        hierarchy: hierarchy,
        isCollapsed: collpsedFiles[item.path],
        haveFailure,
        isExecuting: executingTests.indexOf(item.path) > -1
      });
    }
  }

  if (!isCollapsed) {
    const nextChildren = getChildren(item.path, items);
    nextChildren.forEach(item => {
      transform(
        item as any,
        executingTests,
        failedFiles,
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
