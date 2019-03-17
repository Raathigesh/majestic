import { spawn, ChildProcess } from "child_process";
import { join } from "path";
import Project from "../project";
import { pubsub } from "../../event-emitter";
import { MajesticConfig } from "../types";

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

  run(watch: boolean) {
    this.executeJest(
      ["--reporters", this.getRepoterPath(), ...(watch ? ["--watch"] : [])],
      true
    );
  }

  runSingleFile(path: string, watch: boolean) {
    this.executeJest(
      [
        this.getPatternForPath(path),
        ...(watch ? ["--watch"] : []),
        "--reporters",
        "default",
        this.getRepoterPath()
      ],
      !watch // while watching, can not inherit stdio because we want to write back and interact with the process
    );
  }

  updateSnapshotToFile(path: string) {
    this.executeJest([
      this.getPatternForPath(path),
      "-u",
      "--reporters",
      this.getRepoterPath()
    ]);
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

  executeJest(args: string[] = [], inherit = false) {
    if (!this.config.jestScriptPath) {
      throw new Error("Jest script path is empty");
    }

    this.reportStart();

    this.process = spawn(
      "node",
      [
        "-r",
        this.getPatchFilePath(),
        this.config.jestScriptPath,
        ...args,
        ...(this.config.args || [])
      ],
      {
        cwd: this.project.projectRoot,
        shell: true,
        stdio: inherit ? "inherit" : "pipe",
        env: {
          ...(process.env || {}),
          ...(this.config.env || {}),
          MAJESTIC_PORT: process.env.MAJESTIC_PORT
        }
      }
    );

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

  getRepoterPath() {
    return join(__dirname, "./scripts/reporter.js");
  }

  getPatchFilePath() {
    return join(__dirname, "./scripts/patch.js");
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
      this.process.kill();
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
}
