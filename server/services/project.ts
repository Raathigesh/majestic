import * as directoryTree from "directory-tree";
import { DirectoryItem, TreeMap, MajesticConfig } from "./types";
import { getTestPatternsMatcher } from "./test-file-matcher";

export default class Project {
  public projectRoot: string;
  private testFileMatcher: (path: string) => boolean;

  constructor(root: string) {
    this.projectRoot = root;
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
}
