import * as parser from "@babel/parser";

export function parse(code: string) {
  return parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"]
  });
}
