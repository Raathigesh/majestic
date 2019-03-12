import * as readPkgUp from "read-pkg-up";
import * as resolvePkg from "resolve-pkg";
import { MajesticConfig } from "./types";
import { platform } from "os";
import { join } from "path";
import { existsSync } from "fs";
import { spawnSync } from "child_process";
import { JestConfig } from "./jest-manager/types";

export default class ConfigResolver {
  public getConfig(projectRoot: string): MajesticConfig {
    let jestScriptPath = null;
    let config: MajesticConfig = {};

    if (this.isBootstrappedWithCreateReactApp(projectRoot)) {
      jestScriptPath = this.getJestScriptForCreateReactApp(projectRoot);
      config = {
        args: ["--env=jsdom"],
        env: {
          CI: "true"
        }
      };
    } else {
      jestScriptPath = this.getJestScriptPath(projectRoot);
    }

    const configFromPkgJson =
      this.getMajesticConfigFromPackageJson(projectRoot) || {};

    const configFromJest = this.getConfigFromJest(jestScriptPath, projectRoot);
    const firstConfig = configFromJest.configs[0];
    return {
      ...config,
      jestScriptPath,
      testMatch: firstConfig.testMatch,
      testRegex: firstConfig.testRegex,
      ...configFromPkgJson
    };
  }

  private getJestScriptPath(projectRoot: string) {
    const path = resolvePkg("jest", {
      cwd: projectRoot
    });

    if (!path) {
      throw new Error("Unable to find Jest");
    }

    return join(path, "bin/jest.js");
  }

  private getJestScriptForCreateReactApp(projectRoot: string) {
    const path = resolvePkg("react-scripts", {
      cwd: projectRoot
    });
    return join(path, "scripts/test.js");
  }

  private getPackageJson(rootPath: string) {
    return readPkgUp.sync({
      cwd: rootPath
    }).pkg;
  }

  private getMajesticConfigFromPackageJson(projectRoot: string) {
    const packageJson = this.getPackageJson(projectRoot);
    if (packageJson.majestic) {
      return packageJson.majestic;
    }
    return null;
  }

  private getConfigFromJest(
    jestScriptPath: string,
    projectRoot: string
  ): JestConfig {
    const process = spawnSync(`node ${jestScriptPath}`, ["--showConfig"], {
      cwd: projectRoot,
      shell: true,
      stdio: "pipe",
      env: {}
    });
    const configStr = process.stdout.toString().trim();
    const config = JSON.parse(configStr) as JestConfig;
    return config;
  }

  private isBootstrappedWithCreateReactApp(rootPath: string): boolean {
    return (
      this.hasExecutable(rootPath, "node_modules/.bin/react-scripts") ||
      this.hasExecutable(
        rootPath,
        "node_modules/react-scripts/node_modules/.bin/jest"
      ) ||
      this.hasExecutable(rootPath, "node_modules/react-native-scripts")
    );
  }

  private hasExecutable(rootPath: string, executablePath: string): boolean {
    const ext = platform() === "win32" ? ".cmd" : "";
    const absolutePath = join(rootPath, executablePath + ext);
    return existsSync(absolutePath);
  }
}
