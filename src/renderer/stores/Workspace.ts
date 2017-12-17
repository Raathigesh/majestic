import { observable, computed, action } from "mobx";
import Runner, { TestExecutionResults } from "./runner";
import readAndWatchDirectory, { watchCoverageFiles } from "../util/fileHandler";
import { processTests } from "../util/tree";
import Preference from "./Preference";
import Files from "./Files";
import TreeNode from "./TreeNode";
import ItBlockWithStatus from "../types/it-block";
import { Coverage } from "./Coverage";
import { processCoverageTree } from "../util/coverage-files";

export class Workspace {
  @observable runner: Runner;

  @observable isRunning: boolean;
  @observable files: Files = new Files();
  @observable selectedTest?: TreeNode;
  @observable preference: Preference;
  @observable error: string = "";

  coverage: Coverage;

  constructor() {
    this.preference = new Preference();
  }

  initializeRunner() {
    this.runner = new Runner({
      rootPath: this.preference.rootPath,
      pathToJest: this.preference.jestExecutablePath
    });

    this.coverage = new Coverage(this.preference.rootPath);

    this.runner.getExecutableJSONEmitter().subscribe(
      action((result: TestExecutionResults) => {
        this.files.updateWithAssertionStatus(result.testFileAssertions);
        this.files.updateTotalResult(result.totalResult);
        this.coverage.mapCoverage((result.totalResult as any).coverageMap);
        this.files.updateCoverage(this.coverage);
      })
    );
  }

  loadTestFiles(allFiles = false) {
    const directory = readAndWatchDirectory(this.preference.rootPath);
    directory.subscribe((tree, event) => {
      const { tests, files, nodes } = processTests(
        this.preference.rootPath,
        tree,
        allFiles
      );
      this.files.initialize(tests, files, nodes);
    });

    directory.change(path => {
      const nodeForPath = this.files.getNodeByPath(path);
      if (nodeForPath) {
        let shouldExecute = false;
        if (this.runner.isWatching) {
          if (this.runner.watcherDetails.fileName === path) {
            shouldExecute = true;
          }
        }

        nodeForPath.parseItBlocks(shouldExecute);
      }
    });

    const coverageWatcher = watchCoverageFiles(this.preference.rootPath);
    coverageWatcher.change(files => {
      const coverageFiles = processCoverageTree(
        this.preference.rootPath,
        files
      );
      this.files.initializeCoverageFiles(coverageFiles.files);
    });
  }

  openProject() {
    this.preference.initialize().then(() => {
      this.loadTestFiles();
      this.initializeRunner();
    });
  }

  closeProject() {
    try {
      this.runner.terminate();
    } catch (e) {
      console.log("Process was terminated already.");
    }
    this.preference.rootPath = "";
    this.files.clear();
  }

  runProject() {
    this.files.toggleStatusToAll();
    this.runner.start();
  }

  runCurrentFile() {
    if (!this.selectedTest) return;

    this.selectedTest.spin();
    this.selectedTest.toggleAllTests();
    this.runner.filterByTestFileName(
      this.selectedTest.getRelativePath(this.preference.rootPath)
    );
  }

  runTest(it: ItBlockWithStatus) {
    if (!this.selectedTest) return;
    this.selectedTest.spin();
    it.isExecuting = true;
    this.runner.filterByTestName(
      this.selectedTest.getRelativePath(this.preference.rootPath),
      it.name
    );
  }

  search(query: string) {
    this.files && this.files.search(query);
  }

  updateSnapshot(it: ItBlockWithStatus) {
    it.updatingSnapshot = true;
    this.runner.updateSnapshot(it.name).then(() => {
      it.snapshotErrorStatus = "updated";
      it.status = "KnownSuccess";
      it.assertionMessage = "";
      it.updatingSnapshot = false;
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

  stop() {
    this.runner.terminate();
    this.files.resetStatus();
  }

  @computed
  get coverageForFile() {
    if (this.selectedTest) {
      return this.coverage.getCoverageForFile(this.selectedTest.path);
    }

    return null;
  }

  @computed
  get isProjectAvailable() {
    return !!this.preference.rootPath;
  }
}

const workspace = new Workspace();
export default workspace;
