import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { Runner } from "./type";
import JestManager from "../../services/jest-manager";
import Workspace from "../../services/project";

@Resolver(Runner)
export default class RunnerResolver {
  private jestManager: JestManager;
  private workspace: Workspace;

  constructor() {
    this.workspace = new Workspace("");
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
}
