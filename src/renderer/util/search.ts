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
