import { resolve, normalize } from 'path';
import { Config } from './types/Config';

const micromatch = require('micromatch');
const { replacePathSepForRegex } = require('jest-regex-util');

const globsToMatcher = (globs: any[]) => {
  if (globs == null || globs.length === 0) {
    return () => true;
  }
  const matchers = globs.map(each => micromatch.matcher(each, { dot: true }));
  return (value: string) => matchers.some(each => each(value));
};

const pathToRegex = (p: string) => replacePathSepForRegex(p);
const regexToMatcher = (testRegex: string) => {
  if (!testRegex) {
    return () => true;
  }
  const regex = new RegExp(pathToRegex(testRegex));
  return (value: string) => regex.test(value);
};

export function getTestPatternsMatcher(rootPath: string, config: Config) {
  let matcher: (path: string) => any = () => ({});

  if (config.testMatch && config.testMatch.length) {
    matcher = globsToMatcher(
      config.testMatch.map(match => replaceRootDirInPath(rootPath, match))
    );
  } else if (config.testRegex) {
    matcher = regexToMatcher(config.testRegex);
  }

  return matcher;
}

function replaceRootDirInPath(rootDir: string, filePath: string): string {
  if (!/^<rootDir>/.test(filePath)) {
    return filePath;
  }

  return resolve(
    rootDir,
    normalize('./' + filePath.substr('<rootDir>'.length))
  );
}
