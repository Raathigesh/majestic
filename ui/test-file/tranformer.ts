import { TestItem } from "../../server/api/workspace/test-item";

export interface TestFileItem extends TestItem {
  children?: TestFileItem[];
}

export function transform(
  item: TestFileItem,
  items: TestItem[],
  tree?: TestFileItem
) {
  if (!item) {
    return {};
  }

  const nextChildren = getChildren(item.id, items);
  if (!tree) {
    tree = {
      id: item.id,
      type: item.type,
      name: item.name,
      parent: item.parent,
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

function getChildren(id: string, items: TestItem[]) {
  return items.filter(item => item.parent === id);
}
