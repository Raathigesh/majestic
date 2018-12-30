import { spawnSync } from "child_process";
import { join } from "path";
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

  executeJestSync(args: string[]) {
    return spawnSync(`node ${this.getJestScriptPath()}`, args, {
      cwd: this.project.projectRoot,
      shell: true,
      stdio: "pipe",
      env: {}
    });
  }
}
