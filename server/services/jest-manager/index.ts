import { spawnSync } from "child_process";
import { join } from "path";
import * as execa from "execa";
import Project from "../project";
import { ShowConfig } from "./cli-args";
import { JestConfig } from "./types";

export default class JestManager {
  project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  getJestScriptPath() {
    //TODO: Improve jest.js resolution
    return join(
      this.project.projectRoot,
      "\\node_modules\\jest-cli\\bin\\jest.js"
    );
  }

  getConfig() {
    const process = this.executeJestSync([ShowConfig]);
    const configStr = process.stdout.toString().trim();
    const config = JSON.parse(configStr) as JestConfig;
    return config;
  }

  async runSingleFile(path: string) {
    const { stdout, stderr } = await this.executeJest([
      this.getPatternForPath(path),
      "--reporters",
      this.getRepoterPath()
    ]);
    return stderr;
  }

  async executeJest(args: string[]) {
    return await execa(`node ${this.getJestScriptPath()}`, args, {
      cwd: this.project.projectRoot,
      shell: true,
      stdio: "pipe",
      env: {}
    });
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
