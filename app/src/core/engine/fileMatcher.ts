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

export function getTestPatternsMatcher({ projectConfig }: any) {
  let matcher: (path: string) => any = () => ({});

  if (projectConfig.testMatch) {
    matcher = globsToMatcher(projectConfig.testMatch);
  } else if (projectConfig.testRegex) {
    matcher = regexToMatcher(projectConfig.testRegex);
  }

  return matcher;
}
