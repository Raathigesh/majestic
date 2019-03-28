import { TestItem } from "../../server/api/workspace/test-item";

export interface TestFileItem extends TestItem {
  children?: TestFileItem[];
  index: number;
}

export function transform(
  item: TestFileItem,
  items: TestItem[],
  index: number = 0,
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
      only: item.only,
      children: nextChildren,
      index: index + 1
    } as any;
  }
  item.children = nextChildren as any;
  item.children &&
    item.children.forEach(item => {
      transform(item, items, index + 1, tree);
    });
  return tree;
}

function getChildren(id: string, items: TestItem[]) {
  return items.filter(item => item.parent === id);
}
