import {
  Runner,
  TestReconciler,
  JestTotalResults,
  TestFileAssertionStatus
} from "jest-editor-support";
import * as Rx from "rxjs";
import { observable, autorun } from "mobx";
import { createProcess } from "../util/Process";
import { executeInSequence } from "../util/jest";

export interface TestExecutionResults {
  totalResult: JestTotalResults;
  testFileAssertions: TestFileAssertionStatus[];
}

export default class TestRunner {
  @observable isRunning: boolean = false;
  @observable isWatchMode: boolean = true;
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

        this.setDisplayText();
        console.log("executableJSON", data);
      })
      .on("debuggerProcessExit", () => {
        this.isRunning = false;
        this.isWatching = false;

        this.setDisplayText();
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

    this.isRunning = true;
    this.runner.start(this.isWatchMode);

    this.setDisplayText();
  }

  updateSnapshot(testName: string) {
    return new Promise((resolve, reject) => {
      this.runner.runJestWithUpdateForSnapshots(
        () => {
          debugger;
          resolve();
        },
        ["--testNamePattern", testName]
      );
    });
  }

  filterByTestFileName(testFileNamePattern: string) {
    this.setTestFilterPatterns(testFileNamePattern, "");

    if (this.isWatching) {
      this.interactiveFilterByFileName(this.testFileNamePattern);
    } else {
      this.start(this.testFileNamePattern, this.testNamePattern);
    }

    this.setDisplayText();
  }

  filterByTestName(testFileNamePattern: string, testNamePattern: string) {
    this.setTestFilterPatterns(testFileNamePattern, testNamePattern);

    if (this.isWatching) {
      this.interactiveFilterByTestName(this.testNamePattern);
    } else {
      // if process is not running... start a new one
      this.start(this.testFileNamePattern, this.testNamePattern);
    }

    this.setDisplayText();
  }

  terminate() {
    (this.runner as any).debugprocess.kill();
    this.isRunning = false;

    if (this.isWatchMode) {
      this.isWatching = false;
    }

    this.setDisplayText();
  }

  private setTestFilterPatterns(fileName, testName) {
    this.testFileNamePattern = fileName !== "" ? `^${fileName}$` : "";
    this.testNamePattern = testName !== "" ? `^${testName}$` : "";
  }

  private setDisplayText() {
    this.displayText = "";
    if (this.isRunning) {
      this.displayText = "Booting jest";
    } else if (this.isWatching) {
      if (this.testFileNamePattern && this.testNamePattern) {
        this.displayText = `Watching ${this.testNamePattern} in ${
          this.testFileNamePattern
        }`;
      } else if (this.testFileNamePattern && !this.testNamePattern) {
        this.displayText = `Watching tests in file ${this.testFileNamePattern}`;
      } else {
        this.displayText = "Watching for changes";
      }
    }
  }

  private rerunAllTests() {
    const debugProcess = (this.runner as any).debugprocess;
    debugProcess.stdin.write("a");
  }

  private interactiveFilterByTestName(testNameRegex: string) {
    const debugProcess = (this.runner as any).debugprocess;

    executeInSequence([
      {
        fn: () => debugProcess.stdin.write("t"),
        delay: 0
      },
      {
        fn: () => debugProcess.stdin.write(testNameRegex),
        delay: 100
      },
      {
        fn: () => debugProcess.stdin.write(new Buffer("0d", "hex").toString()),
        delay: 200
      }
    ]);
  }

  private interactiveFilterByFileName(testFileNameRegex: string) {
    const debugProcess = (this.runner as any).debugprocess;

    executeInSequence([
      {
        fn: () => debugProcess.stdin.write("p"),
        delay: 0
      },
      {
        fn: () => debugProcess.stdin.write(testFileNameRegex),
        delay: 100
      },
      {
        fn: () => debugProcess.stdin.write(new Buffer("0d", "hex").toString()),
        delay: 200
      }
    ]);
  }
}
