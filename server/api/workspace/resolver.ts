import {
  Resolver,
  Arg,
  Query,
  Subscription,
  Root,
  Mutation
} from "type-graphql";
import { Workspace } from "./workspace";
import Project from "../../services/project";
import { root } from "../../services/cli";
import JestManager from "../../services/jest-manager";
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

@Resolver(Workspace)
export default class WorkspaceResolver {
  private project: Project;
  private jestManager: JestManager;
  private results: Results;

  constructor() {
    this.project = new Project(root);
    this.jestManager = new JestManager(this.project);
    this.results = new Results();
  }

  @Query(returns => Workspace)
  workspace() {
    const workspace = new Workspace();
    workspace.projectRoot = this.project.projectRoot;
    workspace.name = "Jest project";

    const jestConfig = this.jestManager.getConfig();
    const fileMap = this.project.readTestFiles(jestConfig);
    workspace.files = Object.entries(fileMap).map(([key, value]) => ({
      name: value.name,
      path: value.path,
      parent: value.parent,
      type: value.type
    }));

    return workspace;
  }

  @Mutation(returns => String)
  toggleFile(
    @Arg("path") path: string,
    @Arg("isExpanded") isExpanded: boolean
  ) {
    return this.project.toggleItem(path, isExpanded);
  }

  @Query(returns => TestFile)
  file(@Arg("path") path: string) {
    const file = new TestFile();
    file.items = inspect(path);
    return file;
  }

  @Query(returns => TestFileResult, { nullable: true })
  result(@Arg("path") path: string) {
    const result = this.results.getResult(path);
    return result.report;
  }

  @Subscription(returns => TestFile, {
    topics: [WatcherEvents.FILE_CHANGE]
  })
  fileChange(@Root() event: FileChangeEvent, @Arg("path") path: string) {
    const file = new TestFile();
    file.items = inspect(event.payload.path);
    return file;
  }

  @Subscription(returns => TestFileResult, {
    topics: [Events.TEST_START, Events.TEST_RESULT],
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
    result.path = path;
    if (event.id === Events.TEST_RESULT) {
      const testResult = payload.result.testResult;
      result.path = payload.path;
      result.failureMessage = testResult.failureMessage;
      result.numPassingTests = testResult.numPassingTests;
      result.numFailingTests = testResult.numFailingTests;
      result.numPendingTests = testResult.numPendingTests;
      result.testResults = testResult.testResults;

      this.results.setTestReport(path, result);
    }
    return result;
  }

  @Subscription(returns => Summary, {
    topics: [Events.RUN_SUMMARY]
  })
  async changeToSummary(@Root() event: SummaryEvent): Promise<Summary> {
    const { numFailedTests, numPassedTests } = event.payload.summary;

    const summary = new Summary();
    summary.numFailedTests = numFailedTests;
    summary.numPassedTests = numPassedTests;

    this.results.setSummary(numPassedTests, numFailedTests);
    return summary;
  }

  @Query(returns => Summary, { nullable: true })
  summary() {
    const { numFailedTests, numPassedTests } = this.results.getSummary();
    const result = new Summary();
    result.numFailedTests = numFailedTests;
    result.numPassedTests = numPassedTests;
    return result;
  }
}
