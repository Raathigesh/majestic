import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { App } from "./app";

@Resolver(App)
export default class AppResolver {
  private appInstance: App;

  constructor() {
    this.appInstance = new App();
  }

  @Query(returns => App)
  app() {
    return this.appInstance;
  }

  @Mutation(returns => App)
  setSelectedFile(@Arg("path") path: string) {
    this.appInstance.selectedFile = path;
    return this.appInstance;
  }
}
