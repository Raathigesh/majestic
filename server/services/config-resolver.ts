import * as parseArgs from "minimist";
import * as readPkgUp from "read-pkg-up";
import * as resolvePkg from "resolve-pkg";
import { MajesticConfig } from "./types";
import { platform } from "os";
import { join } from "path";
import { existsSync } from "fs";
import { createLogger } from "../logger";

declare var consola: any;
const log = createLogger("Config Resolver");

export default class ConfigResolver {
  public getConfig(projectRoot: string): MajesticConfig {
    let jestScriptPath = null;
    let args: string[] = [];
    let env: any = {};
    const configFromPkgJson = this.getConfigFromPackageJson(projectRoot) || {};

    const jestScriptPathFromPackage = configFromPkgJson.jestScriptPath
      ? join(projectRoot, configFromPkgJson.jestScriptPath)
      : null;

    if (this.isBootstrappedWithCreateReactApp(projectRoot)) {
      log("Project identified as Create react app");

      jestScriptPath =
        jestScriptPathFromPackage ||
        this.getJestScriptForCreateReactApp(projectRoot);
      args = ["--env=jsdom"];
      env = {
        CI: "true"
      };
    } else {
      log("Majestic configuration from Package.json: ", configFromPkgJson);

      jestScriptPath =
        jestScriptPathFromPackage || this.getJestScriptPath(projectRoot);
    }

    const configArg = parseArgs(process.argv).config;

    if (configArg && configFromPkgJson.configs) {
      args = [...args, ...(configFromPkgJson.configs[configArg].args || [])];
      env = { ...env, ...(configFromPkgJson.configs[configArg].env || {}) };
    } else {
      args = [...args, ...(configFromPkgJson.args || [])];
      env = { ...env, ...(configFromPkgJson.env || {}) };
    }

    const majesticConfig = {
      jestScriptPath: `"${jestScriptPath}"`,
      args,
      env
    };

    log("Resolved Majestic config :", majesticConfig);
    return majesticConfig;
  }

  private getJestScriptPath(projectRoot: string) {
    const path = resolvePkg("jest", {
      cwd: projectRoot
    });
    log("Path of resolved Jest script: ", path);

    if (!path) {
      consola.error(
        "🚨 Majestic was unable to find Jest package in node_modules folder. But you can provide the path manually. Please take a look at the documentation at https://github.com/Raathigesh/majestic."
      );
      process.exit();
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
