import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { Runner } from "./type";
import JestManager from "../../services/jest-manager";
import Workspace from "../../services/project";
import { root } from "../../services/cli";

@Resolver(Runner)
export default class RunnerResolver {
  private jestManager: JestManager;
  private workspace: Workspace;

  constructor() {
    this.workspace = new Workspace(root);
    this.jestManager = new JestManager(this.workspace);
  }

  @Query(returns => Runner)
  getConfig() {
    const runner = new Runner();
    runner.config = "";
    runner.status = "";
    this.jestManager.getConfig();
    return runner;
  }

  @Mutation(returns => String)
  runFile(@Arg("path") path: string) {
    return this.jestManager.runSingleFile(path);
  }

  @Mutation(returns => String)
  run() {
    return this.jestManager.run();
  }
}
