import {
  Resolver,
  Mutation,
  Arg,
  Query,
  Subscription,
  Root
} from "type-graphql";
import { Runner } from "./type";
import JestManager, {
  RunnerEvents,
  RunnerStoppedEvent
} from "../../services/jest-manager";
import Workspace from "../../services/project";
import { root } from "../../services/cli";
import { RunnerStatus } from "./status";

@Resolver(Runner)
export default class RunnerResolver {
  private jestManager: JestManager;
  private workspace: Workspace;
  private isRunning: boolean;
  private activeFile: string;

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

  @Query(returns => RunnerStatus)
  runnerStatus() {
    const status = new RunnerStatus();
    status.activeFile = this.activeFile;
    status.running = this.isRunning;
    return status;
  }

  @Subscription(returns => RunnerStatus, {
    topics: [RunnerEvents.RUNNER_STOPPED]
  })
  runnerStatusChange(
    @Root() event: RunnerStoppedEvent,
    @Arg("path") path: string
  ) {
    const status = new RunnerStatus();
    status.activeFile = this.activeFile;
    status.running = false;
    return status;
  }

  @Mutation(returns => String)
  runFile(
    @Arg("path") path: string,
    @Arg("watch", { nullable: true }) watch: boolean
  ) {
    this.activeFile = path;
    this.isRunning = true;
    return this.jestManager.runSingleFile(path, watch);
  }

  @Mutation(returns => String)
  run() {
    this.activeFile = "";
    this.isRunning = true;
    return this.jestManager.run();
  }
}
