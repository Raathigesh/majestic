import * as readPkgUp from "read-pkg-up";
import * as resolvePkg from "resolve-pkg";
import { MajesticConfig } from "./types";
import { platform } from "os";
import { join } from "path";
import { existsSync } from "fs";
import { CouldNotResolveJestPath } from "./errors";
import { debugLog } from "../logger";

export default class ConfigResolver {
  public getConfig(projectRoot: string): MajesticConfig {
    let jestScriptPath = null;
    let args: string[] = [];
    let env: any = {};
    const configFromPkgJson = this.getConfigFromPackageJson(projectRoot) || {};

    if (this.isBootstrappedWithCreateReactApp(projectRoot)) {
      jestScriptPath = this.getJestScriptForCreateReactApp(projectRoot);
      args = ["--env=jsdom"];
      env = {
        CI: "true"
      };
    } else {
      debugLog("Config from Package.json: ", configFromPkgJson);
      const jestScriptPathFromPackage = configFromPkgJson.jestScriptPath
        ? join(projectRoot, configFromPkgJson.jestScriptPath)
        : null;
      jestScriptPath =
        jestScriptPathFromPackage || this.getJestScriptPath(projectRoot);
      args = configFromPkgJson.args || [];
      env = configFromPkgJson.env || {};
    }

    return {
      jestScriptPath,
      args,
      env
    };
  }

  private getJestScriptPath(projectRoot: string) {
    const path = resolvePkg("jest", {
      cwd: projectRoot
    });
    debugLog("Path of resolved Jest package: ", path);
    if (!path) {
      throw new CouldNotResolveJestPath("");
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

  private getConfigFromPackageJson(projectRoot: string) {
    const packageJson = this.getPackageJson(projectRoot);
    if (packageJson.majestic) {
      return packageJson.majestic;
    }
    return null;
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
