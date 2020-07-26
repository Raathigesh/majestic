import {
  Resolver,
  Arg,
  Query,
  Subscription,
  Root,
  Mutation
} from "type-graphql";
import * as throttle from "lodash.throttle";
import { Workspace } from "./workspace";
import Project from "../../services/project";
import { root } from "../../services/cli";
import { RunnerEvents } from "../../services/jest-manager";
import { TestFile } from "./test-file";
import { inspect } from "../../services/ast/inspector";
import { TestFileResult } from "./test-result/file-result";
import {
  Events,
  ResultEvent,
  SummaryEvent
} from "../../services/result-handler-api";
import Results from "../../services/results";
import { WatcherEvents, FileChangeEvent } from "../../services/file-watcher";
import { Summary } from "./summary";
import { pubsub } from "../../event-emitter";
import ConfigResolver from "../../services/config-resolver";
import { MajesticConfig } from "../../services/types";

const SummaryEvent: "SummaryEvent" = "SummaryEvent";

@Resolver(Workspace)
export default class WorkspaceResolver {
  private project: Project;
  private results: Results;
  private majesticConfig: MajesticConfig;

  constructor() {
    this.project = new Project(root);
    const configResolver = new ConfigResolver();
    this.majesticConfig = configResolver.getConfig(root);
    this.results = new Results(root);
    this.results.getCoverageReportPath(this.majesticConfig);

    pubsub.publish("WorkspaceInitialized", {
      coverageDirectory: this.results.coverageDirectory
    });

    this.results.checkIfCoverageReportExists();

    pubsub.subscribe(Events.TEST_RESULT, ({ payload }: any) => {
      const result = new TestFileResult();
      result.path = payload.path;
      result.failureMessage = payload.failureMessage;
      result.numPassingTests = payload.numPassingTests;
      result.numFailingTests = payload.numFailingTests;
      result.numPendingTests = payload.numPendingTests;
      result.testResults = payload.testResults;
      result.consoleLogs = payload.console;
      this.results.setTestReport(payload.path, result);
      this.notifySummaryChange();
    });

    pubsub.subscribe(Events.TEST_START, ({ payload }: any) => {
      this.results.setTestStart(payload.path);
      this.notifySummaryChange();
    });

    pubsub.subscribe(Events.RUN_SUMMARY, ({ payload }: any) => {
      const {
        numFailedTests,
        numPassedTests,
        numPassedTestSuites,
        numFailedTestSuites
      } = payload.summary;

      this.results.setSummary(
        numPassedTests,
        numFailedTests,
        numPassedTestSuites,
        numFailedTestSuites
      );
      this.notifySummaryChange();
    });

    pubsub.subscribe(Events.RUN_COMPLETE, ({ payload }) => {
      this.results.mapCoverage(payload.coverageMap);

      setTimeout(() => {
        this.results.checkIfCoverageReportExists();
        this.notifySummaryChange();
      }, 2000);
    });

    pubsub.subscribe(RunnerEvents.RUNNER_STOPPED, () => {
      this.results.markExecutingAsStopped();
    });
  }

  private notifySummaryChange = throttle(() => {
    pubsub.publish(SummaryEvent, {});
  }, 1000);

  @Query(returns => Workspace)
  workspace() {
    const workspace = new Workspace();
    workspace.projectRoot = this.project.projectRoot;
    workspace.name = "Jest project";

    const fileMap = this.project.getFilesList(this.majesticConfig);
    workspace.files = Object.entries(fileMap).map(([key, value]: any) => ({
      name: value.name,
      path: value.path,
      parent: value.parent,
      type: value.type
    }));

    return workspace;
  }

  @Query(returns => TestFile)
  async file(@Arg("path") path: string) {
    const file = new TestFile();
    file.items = await inspect(path);
    return file;
  }

  @Query(returns => TestFileResult, { nullable: true })
  result(@Arg("path") path: string) {
    const result = this.results.getResult(path);
    return result ? result : null;
  }

  @Subscription(returns => TestFile, {
    topics: [WatcherEvents.FILE_CHANGE]
  })
  async fileChange(@Root() event: FileChangeEvent, @Arg("path") path: string) {
    const file = new TestFile();
    file.items = await inspect(event.payload.path);
    return file;
  }

  @Subscription(returns => TestFileResult, {
    topics: [
      Events.TEST_START,
      Events.TEST_RESULT,
      RunnerEvents.RUNNER_STOPPED
    ],
    filter: ({ payload: { payload }, args }) => {
      return payload.path === args.path;
    }
  })
  async changeToResult(
    @Root() event: ResultEvent,
    @Arg("path") path: string
  ): Promise<TestFileResult> {
    const payload = event.payload;
    const result = new TestFileResult();
    if (event.id === Events.TEST_START) {
      const existingResults = this.results.getResult(path);
      if (existingResults) {
        result.testResults =  existingResults.testResults;
      }
    }
    else if (event.id === Events.TEST_RESULT) {
      result.path = path;
      result.failureMessage = payload.failureMessage;
      result.numPassingTests = payload.numPassingTests;
      result.numFailingTests = payload.numFailingTests;
      result.numPendingTests = payload.numPendingTests;
      result.testResults = payload.testResults;
      result.consoleLogs = payload.console;
    }
    return result;
  }

  @Subscription(returns => Summary, {
    topics: [SummaryEvent]
  })
  async changeToSummary(@Root() event: SummaryEvent): Promise<Summary> {
    const {
      numFailedTests,
      numPassedTests,
      numPassedTestSuites,
      numFailedTestSuites
    } = this.results.getSummary();

    const summary = new Summary();
    summary.numFailedTests = numFailedTests;
    summary.numPassedTests = numPassedTests;
    summary.numPassedTestSuites = numPassedTestSuites;
    summary.numFailedTestSuites = numFailedTestSuites;
    summary.failedTests = this.results.getFailedTests();
    summary.executingTests = this.results.getExecutingTests();
    summary.passingTests = this.results.getPassedTests();
    summary.coverage = this.results.getCoverage();
    summary.haveCoverageReport = this.results.doesHaveCoverageReport();
    return summary;
  }

  @Query(returns => Summary, { nullable: true })
  summary() {
    const {
      numFailedTests,
      numPassedTests,
      numPassedTestSuites,
      numFailedTestSuites
    } = this.results.getSummary();
    const result = new Summary();
    result.numFailedTests = numFailedTests;
    result.numPassedTests = numPassedTests;
    result.numPassedTestSuites = numPassedTestSuites;
    result.numFailedTestSuites = numFailedTestSuites;
    result.failedTests = this.results.getFailedTests();
    result.executingTests = this.results.getExecutingTests();
    result.passingTests = this.results.getPassedTests();
    result.coverage = this.results.getCoverage();
    result.haveCoverageReport = this.results.doesHaveCoverageReport();
    return result;
  }
}
