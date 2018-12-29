import { writeFile } from "../io";
import { join } from "path";
import functionalComponentTemplate from "./functional-component-template";

export async function createFunctionalComponent(
  directory: string,
  name: string
) {
  const content = functionalComponentTemplate(name);
  await writeFile(join(directory, `${name}.jsx`), content);
}
