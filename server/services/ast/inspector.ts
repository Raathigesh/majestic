import traverse from "@babel/traverse";
import { parse } from "./parser";
import { readFile } from "fs";
import { TestItem, TestItemType } from "../../api/workspace/test-item";
import {IdManagerFactory, IdManager} from './idManager';

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
        const fileIdManager = IdManagerFactory.getManagerForFile(path);

        traverse(ast, {
          CallExpression(path: any) {
            if (path.scope.block.type === "Program") {
              findItems(path, result, fileIdManager);
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
function getNodeName(path: any): string {
  return (path.node.arguments[0].type === "TemplateLiteral")
    ? getTemplateLiteralName(path)
    : path.node.arguments[0].value;
}

function findItems(path: any, result: TestItem[], idManager: IdManager, parentId?: any) {
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
    const nodeName = getNodeName(path);
    let describe = {
        id: idManager.createId(nodeName),
        type: "describe" as TestItemType,
        name: nodeName,
        only,
        parent: parentId
      };
    result.push(describe);
    path.skip();
    path.traverse({
      CallExpression(itPath: any) {
        findItems(itPath, result, IdManagerFactory.getManagerForBlock(describe.id), describe.id);
      }
    });
  } else if (type === "it") {
    const nodeName = getNodeName(path);
    result.push({
      id: idManager.createId(nodeName),
      type: "it",
      name: nodeName,
      only,
      parent: parentId
    });
  } else if (type === "todo") {
    const nodeName = getNodeName(path);
    result.push({
      id: idManager.createId(nodeName),
      type: "todo",
      name: nodeName,
      only,
      parent: parentId
    });
  }
}
