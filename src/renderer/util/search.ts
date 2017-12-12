import TreeNode from "../stores/TreeNode";

export function filterFiles(
  nodes,
  filter,
  filterFunc: (node?: TreeNode) => Boolean = () => true
) {
  const result: TreeNode[] = [];
  nodes.forEach((node: TreeNode) => {
    if (
      (node.label as string).toLowerCase().includes(filter.toLowerCase()) &&
      filterFunc(node)
    ) {
      result.push(node);
    }
  });
  return result;
}

function matcher(node) {
  if (node.type === "directory") {
    return false;
  } else if (node.type !== "directory") {
    return node.isTest;
  }

  return false;
}

const findNode = node => {
  const isNodeAMatch = matcher(node);
  const hasChildren = node.childNodes && node.childNodes.length;
  const doesAnyChildMatch =
    hasChildren && !!node.childNodes.find(child => findNode(child));

  return isNodeAMatch || doesAnyChildMatch;
};

export function filterTree(node) {
  if (matcher(node) && !node.childNodes) {
    return node;
  }
  // If not then only keep the ones that match or have matching descendants
  let filtered = node.childNodes;
  filtered = filtered.filter(child => findNode(child));
  node.childNodes = filtered;
  filtered = filtered.map(child => filterTree(child));

  return filtered.length > 0 ? node : [];
}
