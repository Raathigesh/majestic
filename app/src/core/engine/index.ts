const { readConfig } = require('jest-config');
import { getTestPatternsMatcher } from './fileMatcher';
import TestFiles from './TestFiles';
import Runner from './Runner';
import { Config } from './types/Config';
import Watcher from './Watcher';
const launchEditor = require('react-dev-utils/launchEditor');

export default class Engine {
  root: string;
  config: any = null;
  testMatcher: (path: string) => boolean;
  testFiles: TestFiles;
  testRunner: Runner;
  watcher: Watcher;

  constructor(rootPath: string, config: Config) {
    this.root = rootPath;
    this.config = readConfig({}, rootPath);
    this.testMatcher = getTestPatternsMatcher(rootPath, config);
    this.testFiles = new TestFiles(this);
    this.testRunner = new Runner(this, config);
    this.watcher = new Watcher(rootPath);
  }

  launchEditor(path: string, lineNo: number) {
    launchEditor(path, lineNo);
  }
}
