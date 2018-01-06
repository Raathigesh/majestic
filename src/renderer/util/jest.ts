import { replacePathSepForRegex } from "jest-regex-util";
const micromatch = require("micromatch");

export async function executeInSequence(
  funcs: Array<{
    fn: () => void;
    delay: number;
  }>
) {
  for (let i = 0; i < funcs.length; i++) {
    await setTimeoutPromisify(funcs[i].fn, funcs[i].delay);
  }
}

function setTimeoutPromisify(fn: () => void, delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      fn();
      resolve();
    }, delay);
  });
}

const globsToMatcher = globs => {
  if (globs == null || globs.length === 0) {
    return () => true;
  }

  const matchers = globs.map(each => micromatch.matcher(each, { dot: true }));
  return path => matchers.some(each => each(path));
};

const pathToRegex = p => replacePathSepForRegex(p);
const regexToMatcher = (testRegex: string) => {
  if (!testRegex) {
    return () => true;
  }

  const regex = new RegExp(pathToRegex(testRegex));
  return path => regex.test(path);
};

export function getTestPatterns(config) {
  let matcher: (path: string) => any = () => {};

  if (config.testMatch) {
    matcher = globsToMatcher(config.testMatch);
  } else if (config.testRegex) {
    matcher = regexToMatcher(config.testRegex);
  }

  return matcher;
}
