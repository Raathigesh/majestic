import * as parser from "@babel/parser";

export function parse(code: string) {
  return parser.parse(code, {
    // parse in strict mode and allow module declarations
    sourceType: "module",

    plugins: ["jsx"]
  });
}
