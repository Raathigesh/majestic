import { Resolver, Mutation, Arg } from "type-graphql";
import { dirname } from "path";
import { createFunctionalComponent } from "../services/scaffolder";

@Resolver()
export default class Scaffolder {
  @Mutation(returns => String)
  async createComponent(
    @Arg("path") path: string,
    @Arg("type") type: string,
    @Arg("name") name: string
  ) {
    if (type === "functional") {
      await createFunctionalComponent(dirname(path), name);
      return "";
    }

    return "";
  }
}
