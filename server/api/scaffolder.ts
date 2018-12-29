import { Resolver, Mutation, Arg } from "type-graphql";

@Resolver()
export default class Scaffolder {
  @Mutation(returns => String)
  async createComponent(
    @Arg("path") path: string,
    @Arg("type") type: string,
    @Arg("name") name: string
  ) {
    return "";
  }
}
