import {
  Runner,
  TestReconciler,
  JestTotalResults,
  TestFileAssertionStatus
} from "jest-editor-support";
import * as Rx from "rxjs";
import { observable, autorun } from "mobx";
import { createProcess } from "../util/Process";

export interface TestExecutionResults {
  totalResult: JestTotalResults;
  testFileAssertions: TestFileAssertionStatus[];
}

export default class TestRunner {
  @observable isRunning: boolean = false;
  @observable isWatchMode: boolean = false;
  @observable isWatching: boolean = false;
  @observable testFileNamePattern: string = "";
  @observable testNamePattern: string = "";
  @observable displayText: string = "";

  runner: Runner;
  reconciler: TestReconciler;
  executableJSONEmitter: Rx.Subject<TestExecutionResults>;
  rootPath: string;
  pathToJest: string;
  localJestMajorVersion: number;
  pathToConfig: string;

  constructor({ rootPath, pathToJest }) {
    this.executableJSONEmitter = new Rx.Subject<TestExecutionResults>();
    this.rootPath = rootPath;
    this.pathToJest = pathToJest;
    this.reconciler = new TestReconciler();

    autorun(() => {
      if (this.isRunning) {
        this.displayText = "Booting jest...";
      }

      if (this.isWatching) {
        if (this.testFileNamePattern && this.testNamePattern) {
          this.displayText = `Watching test ${this.testNamePattern} in file ${
            this.testFileNamePattern
          }`;
        } else if (this.testFileNamePattern) {
          this.displayText = `Watching file ${this.testNamePattern}`;
        } else if (this.testNamePattern) {
          this.displayText = `Watching test ${this.testNamePattern}`;
        }
      }
    });
  }

  initializeRunner({ testFileNamePattern, testNamePattern }) {
    this.runner = new Runner(
      {
        rootPath: this.rootPath,
        pathToJest: this.pathToJest,
        localJestMajorVersion: this.localJestMajorVersion,
        pathToConfig: ""
      },
      {
        testFileNamePattern,
        testNamePattern,
        createProcess
      }
    );

    this.runner
      .on("executableJSON", (data: JestTotalResults) => {
        const results = this.reconciler.updateFileWithJestStatus(data);
        this.executableJSONEmitter.next({
          totalResult: data,
          testFileAssertions: results
        });

        this.isRunning = false;
        console.log("executableJSON", data);
      })
      .on("executableOutput", output => {
        console.log("executableOutput", output);
      })
      .on("executableStdErr", error => {
        console.log("executableStdErr", error.toString());
      })
      .on("nonTerminalError", error => {
        console.log("nonTerminalError", error);
      })
      .on("exception", result => {
        console.log("exception", result);
      })
      .on("terminalError", (error: Buffer) => {
        const message = error.toString();
        const noANSI = message.replace(
          /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
          ""
        );
        console.log("terminalError", message);
        if (noANSI.includes("snapshot test failed")) {
          console.log("terminalError", message);
        }
      });
  }

  getExecutableJSONEmitter() {
    return this.executableJSONEmitter;
  }

  toggleWatchModel(toggle = null) {
    this.isWatchMode = toggle || !this.isWatchMode;
  }

  start(testFileNamePattern: string = "", testNamePattern: string = "") {
    if (this.isRunning) {
      return this.rerunAllTests();
    }

    if (this.isWatchMode) {
      this.isWatching = true;
    }

    this.initializeRunner({
      testFileNamePattern,
      testNamePattern
    });

    this.testFileNamePattern = testFileNamePattern;
    this.testNamePattern = testNamePattern;

    this.isRunning = true;
    this.runner.start(this.isWatchMode);
  }

  updateSnapshot(testName: string) {
    return new Promise((resolve, reject) => {
      this.runner.runJestWithUpdateForSnapshots(
        () => {
          resolve();
        },
        ["--testNamePattern", testName]
      );
    });
  }

  filterByTestFileName(testFileNamePattern: string) {
    this.testFileNamePattern = testFileNamePattern;

    if (this.isRunning) {
      this.interactiveFilterByFileName(testFileNamePattern);
    } else {
      this.start(testFileNamePattern, "");
    }
  }

  filterByTestName(testFileNamePattern: string, testNamePattern: string) {
    this.testNamePattern = testNamePattern;
    this.testFileNamePattern = testFileNamePattern;

    if (this.isRunning) {
      this.interactiveFilterByTestName(testNamePattern);
    } else {
      // if process is not running... start a new one
      this.start(testFileNamePattern, testNamePattern);
    }
  }

  terminate() {
    (this.runner as any).debugprocess.kill();
    this.isRunning = false;

    if (this.isWatchMode) {
      this.isWatching = false;
    }
  }

  private rerunAllTests() {
    const debugProcess = (this.runner as any).debugprocess;
    debugProcess.stdin.write("a");
  }

  private interactiveFilterByTestName(testNameRegex: string) {
    const debugProcess = (this.runner as any).debugprocess;
    debugProcess.stdin.write("t");
    setTimeout(() => {
      debugProcess.stdin.write(testNameRegex);
    }, 100);

    setTimeout(() => {
      // enter key
      debugProcess.stdin.write(new Buffer("0d", "hex").toString());
    }, 200);
  }

  private interactiveFilterByFileName(testFileNameRegex: string) {
    const debugProcess = (this.runner as any).debugprocess;
    debugProcess.stdin.write("p");
    setTimeout(() => {
      // enter key
      debugProcess.stdin.write(testFileNameRegex);
    }, 100);

    setTimeout(() => {
      // enter key
      debugProcess.stdin.write(new Buffer("0d", "hex").toString());
    }, 200);
  }
}
