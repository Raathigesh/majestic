import { spawnSync, spawn, ChildProcess } from "child_process";
import { join } from "path";
import * as execa from "execa";
import * as resolvePkg from "resolve-pkg";
import Project from "../project";
import { ShowConfig } from "./cli-args";
import { JestConfig } from "./types";
import { pubsub } from "../../event-emitter";

export const RunnerEvents = {
  RUNNER_STARTED: "RunnerStarted",
  RUNNER_STOPPED: "RunnerStopped",
  RUNNER_WATCH_MODE_CHANGE: "WatchModeChanged"
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

  constructor(project: Project) {
    this.project = project;
  }

  getJestScriptPath() {
    const path = resolvePkg("jest", {
      cwd: this.project.projectRoot
    });

    return join(path, "bin/jest.js");
  }

  getConfig() {
    const process = this.executeJestSync([ShowConfig]);
    const configStr = process.stdout.toString().trim();
    const config = JSON.parse(configStr) as JestConfig;
    return config;
  }

  run(watch: boolean) {
    this.executeJest([
      "--reporters",
      this.getRepoterPath(),
      ...(watch ? ["--watch"] : [])
    ]);
  }

  runSingleFile(path: string, watch: boolean) {
    this.executeJest([
      this.getPatternForPath(path),
      ...(watch ? ["--watch"] : []),
      "--reporters",
      this.getRepoterPath()
    ]);
  }

  switchToAnotherFile(path: string) {
    this.executeInSequence([
      {
        fn: () => this.process.stdin.write("p"),
        delay: 0
      },
      {
        fn: () => this.process.stdin.write(this.getTestPatternForPath(path)),
        delay: 100
      },
      {
        fn: () => this.process.stdin.write(new Buffer("0d", "hex").toString()),
        delay: 200
      }
    ]);
  }

  executeJest(args: string[]) {
    this.reportStart();

    this.process = spawn(
      `node -r ${this.getPatchFilePath()} ${this.getJestScriptPath()}`,
      args,
      {
        cwd: this.project.projectRoot,
        shell: true,
        stdio: "pipe",
        env: {}
      }
    );

    this.process.on("close", () => {
      this.reportStop();
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

  executeJestSync(args: string[]) {
    return spawnSync(`node ${this.getJestScriptPath()}`, args, {
      cwd: this.project.projectRoot,
      shell: true,
      stdio: "pipe",
      env: {}
    });
  }

  reportStart() {
    pubsub.publish(RunnerEvents.RUNNER_STARTED, {
      id: RunnerEvents.RUNNER_STARTED,
      payload: {
        isRunning: true
      }
    });
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

  getTestPatternForPath(filePath: string) {
    let replacePattern = /\//g;

    if (process.platform === "win32") {
      replacePattern = /\\/g;
    }

    return `^${filePath.replace(replacePattern, ".")}$`;
  }
}
