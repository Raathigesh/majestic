import { observable, computed } from "mobx";
import Runner, { TestExecutionResults } from "./runner";
import readAndWatchDirectory from "../util/fileHandler";
import { processTests } from "../util/tree";
import Preference from "./Preference";
import Files from "./Files";
import TreeNode from "./TreeNode";
import ItBlockWithStatus from "../types/it-block";
import { Coverage } from "./Coverage";

export class Workspace {
  @observable runner: Runner;

  @observable isRunning: boolean;
  @observable files: Files = new Files();
  @observable selectedTest?: TreeNode;
  @observable preference: Preference;
  coverage: Coverage;
  @observable error: string = "";
  constructor() {
    this.preference = new Preference();
  }

  initializeRunner() {
    this.runner = new Runner({
      rootPath: this.preference.rootPath,
      pathToJest: this.preference.jestExecutablePath,
      testFileNamePattern: "",
      testNamePattern: ""
    });

    this.coverage = new Coverage(this.preference.rootPath);

    this.runner
      .getExecutableJSONEmitter()
      .subscribe((result: TestExecutionResults) => {
        this.files.updateWithAssertionStatus(result.testFileAssertions);
        this.files.updateTotalResult(result.totalResult);
        this.coverage.mapCoverage((result.totalResult as any).coverageMap);
        this.files.updateCoverage(this.coverage);
      });
  }

  loadTestFiles(allFiles = false) {
    const directory = readAndWatchDirectory(this.preference.rootPath);
    directory.subscribe(tree => {
      const { tests, files, nodes } = processTests(
        this.preference.rootPath,
        tree,
        allFiles
      );
      this.files.initialize(tests, files, nodes);
    });
  }

  openProject() {
    this.preference.initialize().then(() => {
      this.loadTestFiles();
      this.initializeRunner();
    });
  }

  runProject() {
    this.files.toggleStatusToAll();
    this.runner.start();
  }

  runCurrentFile() {
    if (!this.selectedTest) return;

    this.selectedTest.toggleCurrent();
    this.selectedTest.toggleAllTests();
    this.runner.filterByTestFileName(this.selectedTest.label as string);
  }

  runTest(it: ItBlockWithStatus) {
    if (!this.selectedTest) return;
    this.selectedTest.toggleCurrent();
    it.isExecuting = true;
    this.runner.filterByTestName(it.name);
  }

  search(query: string) {
    this.files && this.files.search(query);
  }

  updateSnapshot(it: ItBlockWithStatus) {
    this.runner.updateSnapshot(it.name).then(() => {
      it.snapshotErrorStatus = "updated";
    });
  }

  selectFile(path: string) {
    this.selectedTest = this.files.getNodeByPath(path);

    if (this.selectedTest) {
      this.files.unhighlightAll();
      this.selectedTest.highlight();

      if (!this.selectedTest.isTest) {
        this.selectedTest.readContent();
      }
    }
  }

  @computed
  get coverageForFile() {
    if (this.selectedTest) {
      return this.coverage.getCoverageForFile(this.selectedTest.path);
    }

    return null;
  }
}

const workspace = new Workspace();
export default workspace;
