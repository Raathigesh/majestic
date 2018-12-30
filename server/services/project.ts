import * as directoryTree from "directory-tree";
import * as micromatch from "micromatch";
import { JestConfig } from "./jest-manager/types";
import { Item } from "../api/Workspace/tree";
import { DirectoryItem, TreeMap } from "./types";

export default class Project {
  public projectRoot: string;
  private testFileMatcher: (path: string) => boolean;

  constructor(root: string) {
    this.projectRoot = root;
  }

  public readTestFiles = (jestConfig: JestConfig) => {
    this.testFileMatcher = this.getTestFileMatcher(jestConfig);
    const files = directoryTree(this.projectRoot, {
      exclude: /node_modules|\.git/
    });
    return this.filterTestFiles(files, {});
  };

  /**
   * Filters only the test files
   */
  private filterTestFiles = (
    { name, path, type, children }: DirectoryItem,
    map: TreeMap,
    parent?: string
  ): TreeMap => {
    if (
      (type === "directory" &&
        this.hasATestFile({ name, path, type, children })) ||
      (type === "file" && this.testFileMatcher(path))
    ) {
      map[path] = {
        name,
        type,
        path,
        parent
      };
    }
    children &&
      children.forEach(child => {
        this.filterTestFiles(child, map, path);
      });
    return map;
  };

  /**
   * Checks if a directory has a test file in it.
   */
  private hasATestFile = ({ children, type, path }: DirectoryItem): boolean => {
    if (type === "file" && this.testFileMatcher(path)) {
      return true;
    }
    if (children) {
      return children.some(this.hasATestFile);
    }
    return false;
  };

  /**
   * Returns a function which checks if a function is a test file
   * @param config
   */
  private getTestFileMatcher(config: JestConfig) {
    // TODO: figure out how to deal with multiple values in the config array
    const matchers = config.configs[0].testMatch.map(each =>
      micromatch.matcher(each, { dot: true })
    );
    return (path: string) => {
      return matchers.some(each => each(path));
    };
  }
}