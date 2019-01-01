import traverse from "@babel/traverse";
import * as nanoid from "nanoid";
import { parse } from "./parser";
import { readFileSync } from "fs";
import { TestItem, TestItemType } from "../../api/workspace/test-item";

export function inspect(path: string) {
  const code = readFileSync(path, "utf8");
  const ast = parse(code);
  const result: TestItem[] = [];

  traverse(ast, {
    CallExpression(path: any) {
      if (path.node.callee.name === "describe") {
        const describe = {
          id: nanoid(),
          type: "describe" as TestItemType,
          name: path.node.arguments[0].value
        };
        result.push(describe);
        path.traverse(
          {
            CallExpression(itPath: any) {
              if (itPath.node.callee.name === "it") {
                result.push({
                  type: "it",
                  name: itPath.node.arguments[0].value,
                  id: nanoid(),
                  parent: describe.id
                });
              }
            }
          },
          { describe }
        );
      }
    }
  });

  return result;
}
