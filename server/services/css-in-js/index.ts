import traverse from "@babel/traverse";
import generate from "@babel/generator";
import { readFileContent, writeFile } from "../io";
import { parse } from "../ast/parser";
import process, { updateProperty } from "./postcss-plugin";
import StyledComponent from "../../../types/styled-component/type";

interface StyleExpresions {
  name: string;
  cssString: string;
}

export async function getTaggedTemplateExpressionStrings(ast: any) {
  const results: StyleExpresions[] = [];
  traverse(ast, {
    TaggedTemplateExpression(path: any) {
      const cssString = path.node.quasi.quasis[0].value.raw;
      results.push({
        name: path.parent.id.name,
        cssString
      });
    }
  });
  return results;
}

export async function updateCSSProperty(
  path: string,
  name: string,
  property: string,
  value: string
) {
  const content = await readFileContent(path);
  const ast = parse(content);
  let updatedCssString = "";

  traverse(ast, {
    TaggedTemplateExpression(path: any) {
      if (path.parent.id.name === name) {
        const cssString = path.node.quasi.quasis[0].value.raw;
        updatedCssString = updateProperty(cssString, property, value);
        path.node.quasi.quasis[0].value.raw = updatedCssString;
      }
    }
  });

  const code = generate(ast).code;
  await writeFile(path, code);
  return process(updatedCssString);
}

export async function getSyledDeclarations(
  path: string
): Promise<StyledComponent[]> {
  const content = await readFileContent(path);
  const ast = parse(content);

  const cssStrings = await getTaggedTemplateExpressionStrings(ast);
  const declarations = await Promise.all(
    cssStrings.map(async function(cssString) {
      return {
        name: cssString.name,
        declarations: process(cssString.cssString)
      };
    })
  );
  return declarations;
}
