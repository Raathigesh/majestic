// Copied from https://github.com/orta/vscode-jest/blob/master/src/helpers.ts
import { platform } from "os";
import { existsSync, readFileSync } from "fs";
import { normalize, join, resolve } from "path";

export function pathToJest(rootPath: string, pathToJest: string) {
  const path = normalize(pathToJest);

  const defaultPath = normalize("node_modules/.bin/jest");
  if (path === defaultPath && isBootstrappedWithCreateReactApp(rootPath)) {
    // If it's the default, run the script instead
    return platform() === "win32" ? "npm.cmd test --" : "npm test --";
  }

  // For windows support, see https://github.com/orta/vscode-jest/issues/10
  if (!path.includes(".cmd") && platform() === "win32") {
    return path + ".cmd";
  }
  return path;
}

export const _replaceRootDirInPath = (
  rootDir: string,
  filePath: string
): string => {
  if (!/^<rootDir>/.test(filePath)) {
    return filePath;
  }

  return resolve(
    rootDir,
    normalize("./" + filePath.substr("<rootDir>".length))
  );
};

export function getTestFilePattern(rootPath: string) {
  if (isBootstrappedWithCreateReactApp(rootPath)) {
    return [
      "<rootDir>/src/**/__tests__/**/*.{js,jsx,mjs}",
      "<rootDir>/src/**/?(*.)(spec|test).{js,jsx,mjs}"
    ].map(match => {
      return _replaceRootDirInPath(rootPath, match);
    });
  }

  const packageJsonPath = pathToPackageJSON(rootPath);
  if (packageJsonPath === null) {
    throw new Error("Unable to find package json.");
  }

  const content = readFileSync(packageJsonPath);
  const packageJsonObj = JSON.parse(content.toString());

  if (packageJsonObj.jest && packageJsonObj.jest.testMatch) {
    return packageJsonObj.jest.testMatch.map(match => {
      return _replaceRootDirInPath(rootPath, match);
    });
  }
}

function isBootstrappedWithCreateReactApp(rootPath: string): boolean {
  return (
    hasExecutable(rootPath, "node_modules/.bin/react-scripts") ||
    hasExecutable(
      rootPath,
      "node_modules/react-scripts/node_modules/.bin/jest"
    ) ||
    hasExecutable(rootPath, "node_modules/react-native-scripts")
  );
}

function hasExecutable(rootPath: string, executablePath: string): boolean {
  const ext = platform() === "win32" ? ".cmd" : "";
  const absolutePath = join(rootPath, executablePath + ext);
  return existsSync(absolutePath);
}

export function pathToConfig(pathToConfig: string) {
  if (pathToConfig !== "") {
    return normalize(pathToConfig);
  }
  return "";
}

export function pathToPackageJSON(rootPath: string) {
  let path = "";
  if (isBootstrappedWithCreateReactApp(rootPath)) {
    path = normalize(
      "node_modules/react-scripts/node_modules/jest/package.json"
    );
  } else {
    path = normalize("package.json");
  }

  return join(rootPath, path);
}
