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
  RunnerEvent
} from "../../services/jest-manager";
import Workspace from "../../services/project";
import { root } from "../../services/cli";
import { RunnerStatus } from "./status";
import { pubsub } from "../../event-emitter";
import ConfigResolver from "../../services/config-resolver";

@Resolver(Runner)
export default class RunnerResolver {
  private jestManager: JestManager;
  private workspace: Workspace;
  private isRunning: boolean;
  private activeFile: string;
  private isWatching: boolean = false;
  private collectCoverage: boolean = false;

  constructor() {
    this.workspace = new Workspace(root);
    const configResolver = new ConfigResolver();
    const majesticConfig = configResolver.getConfig(root);
    this.jestManager = new JestManager(this.workspace, majesticConfig);
  }

  @Query(returns => RunnerStatus)
  runnerStatus() {
    const status = new RunnerStatus();
    status.activeFile = this.activeFile;
    status.running = this.isRunning;
    status.watching = this.isWatching;
    return status;
  }

  @Query(returns => Boolean)
  shouldCollectCoverage() {
    return this.collectCoverage;
  }

  @Subscription(returns => RunnerStatus, {
    topics: [
      RunnerEvents.RUNNER_STARTED,
      RunnerEvents.RUNNER_STOPPED,
      RunnerEvents.RUNNER_WATCH_MODE_CHANGE,
      RunnerEvents.RUNNER_ACTIVE_FILE_CHANGE
    ]
  })
  runnerStatusChange(@Root() event: RunnerEvent) {
    this.isRunning =
      event.payload.isRunning !== undefined
        ? event.payload.isRunning
        : this.isRunning;

    const status = new RunnerStatus();
    status.activeFile = this.activeFile;
    status.running = this.isRunning;
    status.watching = this.isWatching;
    return status;
  }

  @Mutation(returns => String, { nullable: true })
  runFile(@Arg("path") path: string) {
    this.activeFile = path;

    if (this.isWatching && this.isRunning) {
      pubsub.publish(RunnerEvents.RUNNER_ACTIVE_FILE_CHANGE, {
        id: RunnerEvents.RUNNER_ACTIVE_FILE_CHANGE,
        payload: {}
      });

      return this.jestManager.switchToAnotherFile(path);
    }

    return this.jestManager.runSingleFile(
      path,
      this.isWatching,
      this.collectCoverage
    );
  }

  @Mutation(returns => String, { nullable: true })
  run() {
    this.activeFile = "";
    this.isRunning = true;
    return this.jestManager.run(this.isWatching, this.collectCoverage);
  }

  @Mutation(returns => String, { nullable: true })
  stop() {
    return this.jestManager.stop();
  }

  @Mutation(returns => String, { nullable: true })
  updateSnapshot(@Arg("path") path: string) {
    this.activeFile = path;
    return this.jestManager.updateSnapshotToFile(path);
  }

  @Mutation(returns => RunnerStatus, { nullable: true })
  toggleWatch(@Arg("watch") watch: boolean) {
    this.isWatching = watch;

    pubsub.publish(RunnerEvents.RUNNER_WATCH_MODE_CHANGE, {
      id: RunnerEvents.RUNNER_WATCH_MODE_CHANGE,
      payload: {}
    });
  }

  @Mutation(returns => Boolean)
  setCollectCoverage(@Arg("collect") collect: boolean) {
    this.collectCoverage = collect;
    return this.collectCoverage;
  }
}
