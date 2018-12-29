import * as postcss from "postcss";
import { getTypeForCSSProperty } from "./util";

function processWithPlugin(cssString: string, plugin: any) {
  return postcss([plugin]).process(cssString).css;
}

export interface Declaration {
  name: string;
  value: string;
  type: string;
}

export default function process(cssString: string) {
  const results: Declaration[] = [];
  const DeclarationWalker = postcss.plugin("reignite-style-parser", () => {
    return function(root, result) {
      return root.walkDecls(rule => {
        results.push({
          name: rule.prop,
          value: rule.value,
          type: getTypeForCSSProperty(rule.prop) || ""
        });
      });
    };
  });

  processWithPlugin(cssString, DeclarationWalker);
  return results;
}

export function updateProperty(
  cssString: string,
  propertyName: string,
  propertyValue: string
) {
  const DeclarationWalker = postcss.plugin("reignite-style-parser", () => {
    return function(root, result) {
      if (!hasRule(root, propertyName)) {
        root.append(`${propertyName}:${propertyValue}`);
        return;
      }

      return root.walkDecls(rule => {
        if (rule.prop === propertyName) {
          rule.value = propertyValue;
        }
      });
    };
  });

  return processWithPlugin(cssString, DeclarationWalker);
}

function hasRule(root: any, ruleName: string) {
  return root.some((rule: any) => rule.prop === ruleName);
}
