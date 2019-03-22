import traverse from "@babel/traverse";
import * as nanoid from "nanoid";
import { parse } from "./parser";
import { readFileSync } from "fs";
import { TestItem, TestItemType } from "../../api/workspace/test-item";

export function inspect(path: string) {
  const code = readFileSync(path, "utf8");
  const ast = parse(path, code);
  const result: TestItem[] = [];

  traverse(ast, {
    CallExpression(path: any) {
      if (path.scope.block.type === "Program") {
        findItems(path, result);
      }
    }
  });

  return result;
}

function findItems(path: any, result: TestItem[], parentId?: any) {
  if (path.node.callee.name === "describe") {
    const describe = {
      id: nanoid(),
      type: "describe" as TestItemType,
      name: path.node.arguments[0].value,
      parent: parentId
    };
    result.push(describe);
    path.skip();
    path.traverse({
      CallExpression(itPath: any) {
        findItems(itPath, result, describe.id);
      }
    });
  } else if (
    path.node.callee.name === "it" ||
    path.node.callee.name === "test"
  ) {
    result.push({
      type: "it",
      name: path.node.arguments[0].value,
      id: nanoid(),
      parent: parentId
    });
  } else if (
    (path.node.callee.object && path.node.callee.object.name === "it") ||
    (path.node.callee.object && path.node.callee.object.name === "test")
  ) {
    result.push({
      type: "it",
      name: path.node.arguments[0].value,
      id: nanoid(),
      parent: parentId
    });
  }
}
