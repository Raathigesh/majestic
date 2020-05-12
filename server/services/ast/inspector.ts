import traverse from "@babel/traverse";
import * as nanoid from "nanoid";
import { parse } from "./parser";
import { readFile } from "fs";
import { TestItem, TestItemType } from "../../api/workspace/test-item";

export async function inspect(path: string): Promise<TestItem[]> {
  return new Promise((resolve, reject) => {
    readFile(
      path,
      {
        encoding: "utf8"
      },
      (err, code) => {
        if (err) {
          reject(err);
        }

        let ast;
        try {
          ast = parse(path, code);
        } catch (e) {
          reject(e);
        }

        const result: TestItem[] = [];

        traverse(ast, {
          CallExpression(path: any) {
            if (path.scope.block.type === "Program") {
              findItems(path, result);
            }
          }
        });
        resolve(result);
      }
    );
  });
}

function getTemplateLiteralName(path: any) {
  let currentExpressionIndex = 0;
  return path.node.arguments[0].quasis.reduce((finalText: String, q: any) => {
    if (q.value.raw === "") {
      return finalText.concat(
        `\`\$\{${
          path.node.arguments[0].expressions[currentExpressionIndex++].name
        }\}\``
      );
    } else {
      return finalText.concat(q.value.raw);
    }
  }, "");
}

function findItems(path: any, result: TestItem[], parentId?: any) {
  let type: string;
  let only: boolean = false;
  if (path.node.callee.name === "fdescribe") {
    type = "describe";
    only = true;
  } else if (path.node.callee.name === "fit") {
    type = "it";
    only = true;
  } else if (
    path.node.callee.property &&
    path.node.callee.property.name === "only"
  ) {
    type = path.node.callee.object.name;
    only = true;
  } else if (path.node.callee.name === "test") {
    type = "it";
  } else if (
    path.node.callee.property &&
    path.node.callee.property.name === "todo"
  ) {
    type = "todo";
  } else {
    type = path.node.callee.name;
  }

  if (type === "describe") {
    let describe: any;
    if (path.node.arguments[0].type === "TemplateLiteral") {
      describe = {
        id: nanoid(),
        type: "describe" as TestItemType,
        name: getTemplateLiteralName(path),
        only,
        parent: parentId
      };
    } else {
      describe = {
        id: nanoid(),
        type: "describe" as TestItemType,
        name: path.node.arguments[0].value,
        only,
        parent: parentId
      };
    }
    result.push(describe);
    path.skip();
    path.traverse({
      CallExpression(itPath: any) {
        findItems(itPath, result, describe.id);
      }
    });
  } else if (type === "it") {
    if (path.node.arguments[0].type === "TemplateLiteral") {
      result.push({
        id: nanoid(),
        type: "it",
        name: getTemplateLiteralName(path),
        only,
        parent: parentId
      });
    } else {
      result.push({
        id: nanoid(),
        type: "it",
        name: path.node.arguments[0].value,
        only,
        parent: parentId
      });
    }
  } else if (type === "todo") {
    if (path.node.arguments[0].type === "TemplateLiteral") {
      result.push({
        id: nanoid(),
        type: "todo",
        name: getTemplateLiteralName(path),
        only,
        parent: parentId
      });
    } else {
      result.push({
        id: nanoid(),
        type: "todo",
        name: path.node.arguments[0].value,
        only,
        parent: parentId
      });
    }
  }
}
