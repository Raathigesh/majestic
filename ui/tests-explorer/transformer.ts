import { Item } from "../../server/api/Workspace/tree";

export interface TreeNode extends Item {
  name: string;
  path: string;
  children?: TreeNode[];
  isExpanded?: boolean;
}

export function transform(item: TreeNode, items: Item[], tree?: TreeNode) {
  const nextChildren = getChildren(item.path, items);
  if (!tree) {
    tree = {
      type: item.type,
      name: item.name,
      path: item.path,
      children: nextChildren
    };
  }
  item.children = nextChildren;
  item.children &&
    item.children.forEach(item => {
      transform(item, items, tree);
    });
  return tree;
}

function getChildren(path: string, files: Item[]) {
  return files.filter(file => file.parent === path);
}
