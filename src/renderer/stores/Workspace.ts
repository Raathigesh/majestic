import { observable, computed, action, IObservableArray } from "mobx";
import Mousetrap from "mousetrap";
import { Position, Toaster, IToaster, Intent } from "@blueprintjs/core";
import Runner, { TestExecutionResults } from "./Runner";
import readAndWatchDirectory, { watchCoverageFiles } from "../util/fileHandler";
import { processTests } from "../util/tree";
import Preference from "./Preference";
import Files from "./Files";
import TreeNode from "./TreeNode";
import ItBlockWithStatus from "../types/it-block";
import { Coverage } from "./Coverage";
import { processCoverageTree } from "../util/coverage-files";
import launchEditor from "react-dev-utils/launchEditor";
import { isPackageJSONExists } from "../util/workspace";
import { openProjectFolder } from "../util/electron";
import {ipcRenderer} from 'electron';


export class Workspace {
  @observable runner: Runner;

  @observable isRunning: boolean;
  @observable files: Files = new Files();
  @observable selectedTest?: TreeNode;
  @observable preference: Preference;
  @observable error: string = "";
  @observable showOmni: boolean = false;
  @observable showFailureSummary: boolean = false;
  @observable
  itStatements: IObservableArray<ItBlockWithStatus> = observable([]);
  @observable showOutputPanel = false;
  @observable showSidebar = true;
  itBlocks: Map<string, ItBlockWithStatus[]> = new Map();
  coverage: Coverage;

  toaster: IToaster;

  constructor() {
    this.preference = new Preference();
    this.toaster = Toaster.create({
      className: "majestic-toaster",
      position: Position.TOP
    });

    Mousetrap.bind(["command+space", "ctrl+space"], () => {
      this.showOmni = !this.showOmni;
      return false;
    });

    Mousetrap.bind("esc", () => {
      this.showOmni = false;
      return false;
    });

    Mousetrap.bind(["command+shift+space", "ctrl+shift+space"], () => {
      this.showOutputPanel = true;
      return false;
    });

    Mousetrap.bind(["command+b", "ctrl+b"], () => {
      this.showSidebar = !this.showSidebar;
      return false;
    });
    Mousetrap.bind(["command+o", "ctrl+o"], () => {
      this.openProject();
      return false;
    });
    //Listen for event from main process. 
    ipcRenderer.on('openProject', () => {
      this.openProject();
  });
  }

  initializeRunner() {
    this.runner = new Runner({
      rootPath: this.preference.rootPath,
      pathToJest: this.preference.jestExecutablePath
    });

    this.coverage = new Coverage(this.preference.rootPath);

    const executableJsonEditor = this.runner.getExecutableJSONEmitter();
    executableJsonEditor.subscribe(
      action((result: TestExecutionResults) => {
        // after each test exectuion, results would be given
        this.files.updateWithAssertionStatus(result.testFileAssertions);
        this.files.updateTotalResult(result.totalResult);
        this.coverage.mapCoverage((result.totalResult as any).coverageMap);
        this.files.updateCoverage(this.coverage);
      })
    );

    executableJsonEditor.close(() => {
      // the jest process is exiting, reset the file status
      this.files.resetStatus();
    });
  }

  loadTestFiles(allFiles = false) {
    const directory = readAndWatchDirectory(this.preference.rootPath);
    directory.subscribe((tree, event) => {
      // this would be called when the adds a new file or removes an existing file.

      // the file tree should be converted into a format that blueprint js tree component accepts
      // http://blueprintjs.com/docs/#core/components/tree.tree-node-interface
      const { tests, nodes, itBlocks } = processTests(
        this.preference.rootPath,
        tree,
        allFiles
      );

      // set the nodes to files model
      this.files.initialize(tests, nodes);

      itBlocks.forEach((value: ItBlockWithStatus[], key: string) => {
        this.itBlocks.set(key, value);
      });
    });

    // this handles the file changes particularly.
    directory.change(path => {
      const nodeForPath = this.files.getNodeByPath(path);
      if (nodeForPath) {
        let shouldExecute = false;
        if (this.runner.isWatching) {
          if (
            this.runner.watcherDetails.fileName === path ||
            !this.runner.watcherDetails.fileName
          ) {
            // if the file that is changed if the file that is currently being watched
            // set the execution label
            shouldExecute = true;
          }
        }

        // parse the it statements of the file again
        nodeForPath.parseItBlocks(shouldExecute);
      }
    });

    // This part monitors the coverage directory for changes
    const coverageWatcher = watchCoverageFiles(this.preference.rootPath);
    coverageWatcher.change(files => {
      const coverageFiles = processCoverageTree(
        this.preference.rootPath,
        files
      );
      this.files.initializeCoverageFiles(
        coverageFiles.files,
        coverageFiles.nodes
      );
    });
  }

  openProject() {
    openProjectFolder().then((projectDirectory: string[]) => {
      const rootPath = projectDirectory[0];
      if (this.validateProject(rootPath)) {
        this.preference.initialize(rootPath);
        this.loadTestFiles();
        this.initializeRunner();
      }
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
    this.files.resetStatus();
    this.files.toggleStatusToAll();
    this.runner.start();
  }

  runCurrentFile() {
    if (!this.selectedTest) return;

    this.selectedTest.spin();
    this.selectedTest.toggleAllTests();
    this.runner.filterByTestFileName(this.selectedTest.path);
  }

  runTest(it: ItBlockWithStatus) {
    if (!this.selectedTest) return;
    this.selectedTest.spin();
    it.isExecuting = true;
    this.runner.filterByTestName(this.selectedTest.path, it.name);
  }

  search(query: string) {
    this.files && this.files.search(query);
  }

  updateSnapshot(it: ItBlockWithStatus) {
    it.updatingSnapshot = true;
    this.runner.updateSnapshot(it.name).then(() => {
      // set the status of the it statement
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

      this.showFailureSummary = false;

      if (!this.selectedTest.isTest) {
        this.selectedTest.readContent();
      }
    }
  }

  stop() {
    this.runner.terminate();
  }

  validateProject(rootPath: string) {
    const packageJSONExists = isPackageJSONExists(rootPath);
    if (!packageJSONExists) {
      this.toaster.show({
        message: "This folder does not have a package.json file.",
        intent: Intent.DANGER
      });
    }

    return packageJSONExists;
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

  allItBlocks() {
    const itBlocksWithStatus: ItBlockWithStatus[] = [];
    this.itBlocks.forEach((value: ItBlockWithStatus[], key: string) => {
      itBlocksWithStatus.push(...value);
    });

    return itBlocksWithStatus;
  }

  @action
  highlightTestInFile(path: string, testName: string) {
    const file = this.files.getNodeByPath(path);
    if (!file) {
      return;
    }

    file.highlightItBlocks(testName);

    if (this.selectedTest) {
      this.selectedTest.unhighlight();
    }
    this.selectedTest = file;
    this.selectedTest.highlight();
  }

  launchEditor(it: ItBlockWithStatus) {
    launchEditor(it.filePath, it.lineNumber);
  }
}

const workspace = new Workspace();
export default workspace;
