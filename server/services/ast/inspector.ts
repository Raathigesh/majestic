import traverse from "@babel/traverse";
import { parse } from "./parser";
import { readFileSync } from "fs";

export function inspect(path: string) {
  const code = readFileSync(path, "utf8");
  const ast = parse(code);
  traverse(ast, {
    CallExpression(path: any) {
      if (path.node.callee.name === "describe") {
        console.log(path);
      }
    }
  });
}
