import * as parser from "@babel/parser";
import { extname } from "path";

export function parse(path: string, code: string) {
  const isTS = [".ts", ".tsx"].indexOf(extname(path).toLowerCase()) > -1;
  const additionalPlugin = isTS ? "typescript" : "flow";

  return parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "classProperties", "optionalChaining", additionalPlugin]
  });
}
