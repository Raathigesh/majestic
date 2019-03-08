import * as directoryTree from "directory-tree";
import * as micromatch from "micromatch";
import { DirectoryItem, TreeMap, MajesticConfig } from "./types";
import { getTestPatternsMatcher } from "./test-file-matcher";

export default class Project {
  public projectRoot: string;
  public expandedItems: { [path: string]: true } = {};
  private testFileMatcher: (path: string) => boolean;

  constructor(root: string) {
    this.projectRoot = root;
  }

  public toggleItem(path: string, isExpaned: boolean) {
    if (isExpaned) {
      this.expandedItems[path] = true;
    } else {
      delete this.expandedItems[path];
    }
  }

  public readTestFiles = (jestConfig: MajesticConfig) => {
    this.testFileMatcher = getTestPatternsMatcher(this.projectRoot, jestConfig);
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
  private getTestFileMatcher(config: MajesticConfig) {
    const matchers = (config.testMatch || []).map(each =>
      micromatch.matcher(each, { dot: true })
    );
    return (path: string) => {
      let didRegexMatch = false;
      const testRegex = config.testRegex;
      if (
        (typeof testRegex === "string" || testRegex instanceof String) &&
        testRegex.trim() !== ""
      ) {
        const regex = new RegExp(config.testRegex as string);
        didRegexMatch = regex.test(path);
      }

      const didMatch = matchers.some(each => each(path));
      return didMatch || didRegexMatch;
    };
  }
}
