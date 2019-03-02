import { spawnSync } from "child_process";
import { join } from "path";
import * as execa from "execa";
import * as resolvePkg from "resolve-pkg";
import Project from "../project";
import { ShowConfig } from "./cli-args";
import { JestConfig } from "./types";

export const RunnerEvents = {
  RUNNER_STOPPED: "RunnerStopped"
};

export interface RunnerStoppedEvent {
  id: string;
  payload: {
    path: string;
  };
}

export default class JestManager {
  project: Project;

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

  async run() {
    const { stdout, stderr } = await this.executeJest([
      "--reporters",
      this.getRepoterPath()
    ]);
    return stderr;
  }

  async runSingleFile(path: string, watch: boolean) {
    const { stdout, stderr } = await this.executeJest([
      this.getPatternForPath(path),
      ...(watch ? ["--watch"] : []),
      "--reporters",
      this.getRepoterPath()
    ]);
    return stderr;
  }

  async executeJest(args: string[]) {
    const result = await execa(`node ${this.getJestScriptPath()}`, args, {
      cwd: this.project.projectRoot,
      shell: true,
      stdio: "pipe",
      env: {}
    });
    return result;
  }

  getRepoterPath() {
    return join(__dirname, "./scripts/reporter.js");
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
}
