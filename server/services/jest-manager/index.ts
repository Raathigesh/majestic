import { spawn, ChildProcess, execSync } from "child_process";
import { join } from "path";
import Project from "../project";
import { pubsub } from "../../event-emitter";
import { MajesticConfig } from "../types";
import { createLogger } from "../../logger";

const log = createLogger("Jest Manager");

export const RunnerEvents = {
  RUNNER_STARTED: "RunnerStarted",
  RUNNER_STOPPED: "RunnerStopped",
  RUNNER_WATCH_MODE_CHANGE: "WatchModeChanged",
  RUNNER_ACTIVE_FILE_CHANGE: "RunnerActiveFileChange"
};

export interface RunnerEvent {
  id: string;
  payload: {
    isRunning: boolean;
  };
}

export default class JestManager {
  project: Project;
  process: ChildProcess;
  config: MajesticConfig;

  constructor(project: Project, config: MajesticConfig) {
    this.project = project;
    this.config = config;
  }

  run(watch: boolean, collectCoverage: boolean) {
    this.executeJest(
      [
        "--reporters",
        this.getReporterPath(),
        ...(watch ? [this.getWatchFlag()] : [])
      ],
      true,
      true,
      collectCoverage
    );
  }

  runSingleFile(path: string, watch: boolean, collectCoverage: boolean) {
    this.executeJest(
      [
        this.getPatternForPath(path),
        ...(watch ? [this.getWatchFlag()] : []),
        "--reporters",
        "default",
        this.getReporterPath(),
        "--verbose=false" // this would allow jest to include console output in the result of reporter
      ],
      !watch, // while watching, can not inherit stdio because we want to write back and interact with the process
      false,
      collectCoverage
    );
  }

  updateSnapshotToFile(path: string) {
    this.executeJest(
      [
        this.getPatternForPath(path),
        "-u",
        "--reporters",
        this.getReporterPath()
      ],
      false,
      false,
      false
    );
  }

  switchToAnotherFile(path: string) {
    this.executeInSequence([
      {
        fn: () => this.process.stdin && this.process.stdin.write("p"),
        delay: 0
      },
      {
        fn: () =>
          this.process.stdin &&
          this.process.stdin.write(this.getPatternForPath(path)),
        delay: 100
      },
      {
        fn: () =>
          this.process.stdin &&
          this.process.stdin.write(new Buffer("0d", "hex").toString()),
        delay: 200
      }
    ]);
  }

  executeJest(
    args: string[] = [],
    inherit: boolean,
    shouldReportSummary: boolean,
    collectCoverage: boolean
  ) {
    if (!this.config.jestScriptPath) {
      throw new Error("Jest script path is empty");
    }

    this.reportStart();

    const finalArgs = [
      "-r",
      this.getPatchFilePath(),
      this.config.jestScriptPath,
      ...(this.config.args || []),
      "--colors",
      ...(collectCoverage
        ? ["--collectCoverage=true"]
        : ["--collectCoverage=false"]),
      ...args
    ];

    const finalEnv = {
      ...(this.config.env || {}),
      MAJESTIC_PORT: process.env.MAJESTIC_PORT,
      REPORT_SUMMARY: shouldReportSummary ? "report" : ""
    };

    log("Executing Jest with :", finalArgs, finalEnv);

    this.process = spawn("node", finalArgs, {
      cwd: this.project.projectRoot,
      shell: true,
      stdio: inherit ? "inherit" : "pipe",
      env: { ...(process.env || {}), ...finalEnv }
    });

    this.process.on("exit", () => {
      this.reportStop();
    });

    this.process.stdout &&
      this.process.stdout.on("data", (data: string) => {
        console.log(data.toString().trim());
      });

    this.process.stderr &&
      this.process.stderr.on("data", (data: string) => {
        console.log(data.toString().trim());
      });
  }

  getReporterPath() {
    return `"${join(__dirname, "./scripts/reporter.js")}"`;
  }

  getPatchFilePath() {
    return `"${join(__dirname, "./scripts/patch.js")}"`;
  }

  getPatternForPath(path: string) {
    let replacePattern = /\//g;
    if (process.platform === "win32") {
      replacePattern = /\\/g;
    }
    return `^${path.replace(replacePattern, ".")}$`;
  }

  reportStart() {
    pubsub.publish(RunnerEvents.RUNNER_STARTED, {
      id: RunnerEvents.RUNNER_STARTED,
      payload: {
        isRunning: true
      }
    });
  }

  stop() {
    if (this.process) {
      if (process.platform === "win32") {
        // Windows doesn't exit the process when it should.
        spawn("taskkill", ["/pid", "" + this.process.pid, "/T", "/F"]);
      } else {
        this.process.kill();
      }

      this.reportStop();
    }
  }

  reportStop() {
    pubsub.publish(RunnerEvents.RUNNER_STOPPED, {
      id: RunnerEvents.RUNNER_STOPPED,
      payload: {
        isRunning: false
      }
    });
  }

  async executeInSequence(
    funcs: Array<{
      fn: () => void;
      delay: number;
    }>
  ) {
    for (const { fn, delay } of funcs) {
      await this.setTimeoutPromisify(fn, delay);
    }
  }

  setTimeoutPromisify(fn: () => void, delay: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        fn();
        resolve();
      }, delay);
    });
  }

  getWatchFlag() {
    return this.isInGitRepository() ? "--watch" : "--watchAll";
  }

  isInGitRepository() {
    try {
      execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
      return true;
    } catch (e) {
      return false;
    }
  }
}
