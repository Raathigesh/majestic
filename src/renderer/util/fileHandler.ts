const dirTree = require("directory-tree");
const chokidar = require("chokidar");
import { setTimeout } from "timers";

export function getTestFiles(directory: string) {
  return dirTree(directory, {
    extensions: /\.js/,
    exclude: /node_modules/
  });
}

export default function readAndWatchDirectory(root: string) {
  let subscribeCallback = (value: any) => {};
  let changeCallback = (path: string) => {};

  setTimeout(() => {
    subscribeCallback(getTestFiles(root));
  }, 0);

  chokidar
    .watch(root, { ignored: /node_modules/, ignoreInitial: true })
    .on("all", (event, path) => {
      if (event === "change") {
        changeCallback(path);
      } else {
        subscribeCallback(getTestFiles(root));
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
