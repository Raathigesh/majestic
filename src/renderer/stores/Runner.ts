import {
  Runner,
  TestReconciler,
  JestTotalResults,
  TestFileAssertionStatus
} from "jest-editor-support";
import { observable } from "mobx";
import stripAnsi from "strip-ansi";
const AnsiToHtml = require("ansi-to-html");
import { createProcess } from "../util/Process";
import { executeInSequence, getTestPatternForPath } from "../util/jest";
import WatcherDetails from "./WatcherDetails";
import { getConfigFilePath } from "../util/workspace";

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
  @observable watcherDetails = new WatcherDetails();
  @observable output: string = "";
  @observable isEmittingOutput: boolean = false;
  @observable consoleLogs = observable.shallowArray([]);
  timeoutHandle: any;
  ansiToHtmlConverter = new AnsiToHtml();

  runner: Runner;
  reconciler: TestReconciler;
  executableJSONEmitter: any;
  rootPath: string;
  pathToJest: string;
  localJestMajorVersion: number;
  pathToConfig: string;

  constructor({ rootPath, pathToJest }) {
    // Had RXjs here earlier and then removed it.
    // Trying to mimic the same RxJS subject API for now with this
    // mock object.
    this.executableJSONEmitter = {
      subscribeCallback: null,
      closeCallback: null,
      next: (value: any) => {
        this.executableJSONEmitter.subscribeCallback(value);
      },
      close: (callback: any) => {
        this.executableJSONEmitter.closeCallback = callback;
      },
      subscribe: (callback: any) => {
        this.executableJSONEmitter.subscribeCallback = callback;
      }
    };
    this.rootPath = rootPath;
    this.pathToJest = pathToJest;
    this.reconciler = new TestReconciler();
  }

  initializeRunner({ testFileNamePattern, testNamePattern }) {
    // @ts-ignore
    this.runner = new Runner(
      {
        rootPath: this.rootPath,
        pathToJest: this.pathToJest,
        localJestMajorVersion: this.localJestMajorVersion,
        pathToConfig: getConfigFilePath(this.rootPath)
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
      .on("debuggerProcessExit", () => {
        this.isRunning = false;
        this.isWatching = false;
        this.executableJSONEmitter.closeCallback();
      })
      .on("executableOutput", output => {
        if (output.trim() === "") {
          return;
        }

        const stripped = stripAnsi(output);
        this.detectEchancedConsoleLog(stripped);
        let covertedHtml = this.ansiToHtmlConverter.toHtml(output);
        covertedHtml = covertedHtml.replace(/(\?25l|\?25h)/g, "");
        this.output += covertedHtml;
        console.log(stripped);

        if (this.timeoutHandle) {
          clearTimeout(this.timeoutHandle);
        }

        this.isEmittingOutput = true;
        setTimeout(() => {
          this.isEmittingOutput = false;
        }, 3000);
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

  resetOutputText() {
    this.output = "";
    this.consoleLogs.clear();
  }

  start(testFileNamePattern: string = "", testNamePattern: string = "") {
    this.resetOutputText();

    if (this.isWatching) {
      this.setTestFilterPatterns("", "");
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
  }

  updateSnapshot(testName: string) {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      this.runner.runJestWithUpdateForSnapshots(
        () => {
          resolve();
        },
        ["--testNamePattern", testName]
      );
    });
  }

  filterByTestFileName(testFileNamePattern: string) {
    this.resetOutputText();

    this.setTestFilterPatterns(testFileNamePattern, "");

    if (this.isWatching) {
      this.interactiveFilterByFileName(this.testFileNamePattern);
    } else {
      this.start(this.testFileNamePattern, "");
    }
  }

  filterByTestName(testFileNamePattern: string, testNamePattern: string) {
    this.resetOutputText();

    const shouldRerunFile =
      testFileNamePattern !== this.watcherDetails.fileName;

    this.setTestFilterPatterns(testFileNamePattern, testNamePattern);
    if (this.isWatching) {
      this.interactiveFilterByTestName(
        this.testFileNamePattern,
        this.testNamePattern,
        shouldRerunFile
      );
    } else {
      // if process is not running... start a new one
      this.start(this.testFileNamePattern, this.testNamePattern);
    }
  }

  terminate() {
    (this.runner as any).debugprocess.kill();
    this.isRunning = false;

    if (this.isWatchMode) {
      this.isWatching = false;
    }
  }

  private setTestFilterPatterns(fileName, testName) {
    this.watcherDetails.fileName = fileName;
    this.watcherDetails.testName = testName;

    this.testFileNamePattern =
      fileName !== "" ? `^${getTestPatternForPath(fileName)}$` : "";
    this.testNamePattern = testName;
  }

  private rerunAllTests() {
    const debugProcess = (this.runner as any).debugprocess;
    debugProcess.stdin.write("a");
  }

  private interactiveFilterByTestName(
    testFileNamePattern: string,
    testNameRegex: string,
    runFile = false
  ) {
    const debugProcess = (this.runner as any).debugprocess;

    executeInSequence([
      ...(runFile
        ? [
            {
              fn: () => debugProcess.stdin.write("p"),
              delay: 100
            },
            {
              fn: () => debugProcess.stdin.write(testFileNamePattern),
              delay: 200
            },
            {
              fn: () =>
                debugProcess.stdin.write(new Buffer("0d", "hex").toString()),
              delay: 400
            }
          ]
        : []),
      {
        fn: () => debugProcess.stdin.write("t"),
        delay: 200
      },
      {
        fn: () => debugProcess.stdin.write(testNameRegex),
        delay: 500
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

  private detectEchancedConsoleLog(output: string) {
    const toeksn = output.match(/^ *console\.log .*$(\n|\r\n).*/gm);
    if (toeksn && toeksn.length) {
      const parsed = toeksn.map(tok => {
        const headerAndContent = tok.split(/(\n|\r\n)/);
        const logText = headerAndContent[2];

        let logContent = null;
        try {
          logContent = eval(`(${logText.trim()})`);
        } catch (e) {
          logContent = logText;
        }

        return {
          file: headerAndContent[0].trim().split(" ")[1],
          content: logContent
        };
      });

      this.consoleLogs.push(...parsed);
    }
  }
}
