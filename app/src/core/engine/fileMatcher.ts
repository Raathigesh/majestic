import { Config } from './types/Config';
const micromatch = require('micromatch');
import * as pathUtil from 'path';
const { escapePathForRegex } = require('jest-regex-util');

const globsToMatcher = (globs?: Array<any>) => {
  if (globs == null || globs.length === 0) {
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

class TestFileSearcher {
  _rootPattern: RegExp;
  _testIgnorePattern?: RegExp;
  _testPathCases: {
    roots: (path: string) => boolean;
    testMatch: (path: string) => boolean;
    testRegex: (path: string) => boolean;
    testPathIgnorePatterns: (path: string) => boolean;
  };

  constructor(config: Config) {
    this._rootPattern = new RegExp(
      (config.jest.roots || [])
        .map((dir: string) => escapePathForRegex(dir + pathUtil.sep))
        .join('|')
    );

    const ignorePattern = config.jest.testPathIgnorePatterns || [];
    this._testIgnorePattern = ignorePattern.length
      ? new RegExp(ignorePattern.join('|'))
      : undefined;

    this._testPathCases = {
      roots: path => this._rootPattern.test(path),
      testMatch: globsToMatcher(config.jest.testMatch),
      testPathIgnorePatterns: path =>
        !this._testIgnorePattern || !this._testIgnorePattern.test(path),
      testRegex: regexToMatcher(config.jest.testRegex || '')
    };
  }

  isTestFilePath(path: string): boolean {
    return Object.keys(this._testPathCases).every(key =>
      this._testPathCases[key](path)
    );
  }
}

export function getTestPatternsMatcher(root: string, config: Config) {
  const fileSearcher = new TestFileSearcher(config);

  return (path: string) => fileSearcher.isTestFilePath(path);
}
