import {
  Runner,
  TestReconciler,
  JestTotalResults,
  TestFileAssertionStatus
} from "jest-editor-support";
import * as Rx from "rxjs";
import { observable } from "mobx";
import { createProcess } from "../util/Process";

export interface TestExecutionResults {
  totalResult: JestTotalResults;
  testFileAssertions: TestFileAssertionStatus[];
}

export default class TestRunner {
  @observable isRunning: boolean;
  runner: Runner;
  reconciler: TestReconciler;
  executableJSONEmitter: Rx.Subject<TestExecutionResults>;
  rootPath: string;
  pathToJest: string;
  localJestMajorVersion: number;
  pathToConfig: string;

  constructor({ rootPath, pathToJest, testFileNamePattern, testNamePattern }) {
    this.isRunning = false;
    this.executableJSONEmitter = new Rx.Subject<TestExecutionResults>();
    this.rootPath = rootPath;
    this.pathToJest = pathToJest;

    this.initializeRunner({
      testFileNamePattern,
      testNamePattern
    });
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
      .on("debuggerProcessExit", () => {
        this.isRunning = false;
        console.log("exit");
      })
      .on("executableJSON", (data: JestTotalResults) => {
        const results = this.reconciler.updateFileWithJestStatus(data);
        this.executableJSONEmitter.next({
          totalResult: data,
          testFileAssertions: results
        });
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

  start(testFileNamePattern: string = "", testNamePattern: string = "") {
    if (this.isRunning) {
      return this.rerunAllTests();
    }

    this.initializeRunner({
      testFileNamePattern,
      testNamePattern
    });
    this.isRunning = true;
    this.runner.start();
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

  filterByTestFileName(testFileNameRegex: string) {
    if (this.isRunning) {
      this.interactiveFilterByFileName(testFileNameRegex);
    } else {
      this.start(testFileNameRegex, "");
    }
  }

  filterByTestName(testNameRegex: string) {
    if (this.isRunning) {
      this.interactiveFilterByTestName(testNameRegex);
    } else {
      // if process is not running... start a new one
      this.start("", testNameRegex);
    }
  }

  terminate() {
    this.runner.closeProcess();
    this.isRunning = false;
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
