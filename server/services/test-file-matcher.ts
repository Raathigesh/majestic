const micromatch = require("micromatch");
import * as pathUtil from "path";
import { MajesticConfig } from "./types";
const { escapePathForRegex } = require("jest-regex-util");

const globsToMatcher = (globs?: Array<any>) => {
  if (globs == null || globs.length === 0 || global === undefined) {
    return () => true;
  }

  const matchers = globs.map(each => micromatch.matcher(each, { dot: true }));
  return (path: string) => {
    return matchers.some(each => each(path));
  };
};

const regexToMatcher = (testRegex: string) => {
  if (!testRegex) {
    return () => true;
  }

  const regex = new RegExp(testRegex);
  return (path: string) => regex.test(path);
};

class TestFileMatcher {
  _rootPattern: RegExp;
  _testIgnorePattern?: RegExp;
  _testPathCases: {
    testMatch: (path: string) => boolean;
    testRegex: (path: string) => boolean;
    testPathIgnorePatterns: (path: string) => boolean;
  };

  constructor(projectRoot: string, config: MajesticConfig) {
    this._rootPattern = new RegExp(
      ([projectRoot] || [])
        .map((dir: string) => escapePathForRegex(dir + pathUtil.sep))
        .join("|")
    );

    const ignorePattern: any = []; // TODO
    this._testIgnorePattern = ignorePattern.length
      ? new RegExp(ignorePattern.join("|"))
      : undefined;

    this._testPathCases = {
      testMatch: globsToMatcher(config.testMatch),
      testPathIgnorePatterns: path =>
        !this._testIgnorePattern || !this._testIgnorePattern.test(path),
      testRegex: regexToMatcher((config.testRegex as string) || "")
    };
  }

  isTestFilePath(path: string): boolean {
    return Object.keys(this._testPathCases).every(key =>
      this._testPathCases[key](path)
    );
  }
}

export function getTestPatternsMatcher(
  root: string,
  majesticConfig: MajesticConfig
) {
  const fileSearcher = new TestFileMatcher(root, majesticConfig);

  return (path: string) => {
    const result = fileSearcher.isTestFilePath(path);
    return result;
  };
}
