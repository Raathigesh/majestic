const { readConfig } = require('jest-config');
import { getTestPatternsMatcher } from './fileMatcher';
import TestFiles from './TestFiles';
import Runner from './Runner';

export default class Engine {
  root: string;
  config: any = null;
  testMatcher: (path: string) => boolean;
  testFiles: TestFiles;
  testRunner: Runner;

  constructor(rootPath: string) {
    this.root = rootPath;
    this.config = readConfig({}, rootPath);
    this.testMatcher = getTestPatternsMatcher(this.config);
    this.testFiles = new TestFiles(this);
    this.testRunner = new Runner(this);
  }
}
