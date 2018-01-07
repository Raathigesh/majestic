import * as dirTree from "directory-tree";
import * as chokidar from "chokidar";
import { setTimeout } from "timers";
import { getTestFilePattern } from "./workspace";
import { join } from "path";

export function getTestFiles(directory: string) {
  return dirTree(directory, {
    exclude: /node_modules|\.git/
  });
}

export function getCoverageFiles(directory: string) {
  return dirTree(directory, {
    extensions: /\.html/
  });
}

export default function readAndWatchDirectory(root: string) {
  const isTest = getTestFilePattern(root);

  let subscribeCallback = (value: any, event: string) => {};
  let changeCallback = (path: string) => {};

  setTimeout(() => {
    subscribeCallback(getTestFiles(root), "");
  }, 0);

  chokidar
    .watch(root, { ignored: /node_modules|\.git/, ignoreInitial: true })
    .on("all", (event, path) => {
      if (event === "change") {
        if (isTest(path)) {
          changeCallback(path);
        }
      } else if (event === "add" || event === "unlink") {
        if (isTest(path)) {
          subscribeCallback(getTestFiles(root), event);
        }
      }
    });

  return {
    subscribe(callBack) {
      subscribeCallback = callBack;
    },
    change(callback) {
      changeCallback = callback;
    }
  };
}

export function watchCoverageFiles(root: string) {
  // TODO: remove hardcoded "coverage". Read from config. This is configurable.
  const coveragePath = join(root, "coverage");

  let changeCallback = (path: string) => {};

  setTimeout(() => {
    changeCallback(getCoverageFiles(coveragePath));
  }, 0);

  chokidar
    .watch(coveragePath, { ignoreInitial: true })
    .on("all", (event, path) => {
      changeCallback(getCoverageFiles(coveragePath));
    });

  return {
    change(callback) {
      changeCallback = callback;
    }
  };
}
