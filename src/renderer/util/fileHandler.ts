const dirTree = require("directory-tree");
const chokidar = require("chokidar");
import * as Rx from "rxjs";
import { setTimeout } from "timers";

export function getTestFiles(directory: string) {
  return dirTree(directory, {
    extensions: /\.js/,
    exclude: /node_modules/
  });
}

export default function readAndWatchDirectory(root: string) {
  const subject = new Rx.Subject();

  setTimeout(() => {
    subject.next(getTestFiles(root));
  }, 0);

  chokidar
    .watch(root, { ignored: /node_modules/ })
    .on("change", (event, path) => {
      subject.next(getTestFiles(root));
    });

  return subject;
}
