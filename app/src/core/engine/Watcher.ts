import { getItBlocks } from './util';
import { ItBlock } from './types/ItBlock';
const chokidar = require('chokidar');

export default class Watcher {
  public watcher: any;

  constructor(root: string) {
    this.watcher = chokidar.watch(root, {
      ignored: /node_modules|\.git/,
      ignoreInitial: true
    });
  }

  public handlers(
    onAdd: (path: string) => void,
    onDelete: (path: string) => void,
    onChange: (path: string, itBlocks?: ItBlock[]) => void
  ) {
    if (this.watcher) {
      this.watcher
        .on('add', onAdd)
        .on('change', (path: string) => {
          try {
            onChange(path, getItBlocks(path));
          } catch (e) {
            onChange(path);
          }
        })
        .on('unlink', onDelete);
    }
  }
}
