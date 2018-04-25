import { getItBlocks } from './util';
import { ItBlock } from './types/ItBlock';
const chokidar = require('chokidar');

export default class Watcher {
  public watcher: any;
  public onAddHandler: (path: string) => void = () => ({});
  public onDeleteHandler: (path: string) => void = () => ({});
  public onChangeHandler: (
    path: string,
    itBlocks?: ItBlock[]
  ) => void = () => ({});

  constructor(root: string) {
    this.watcher = chokidar.watch(root, {
      ignored: /node_modules|\.git/,
      ignoreInitial: true
    });

    this.watcher
      .on('add', this.onAddHandler)
      .on('change', (path: string) => {
        try {
          this.onChangeHandler(path, getItBlocks(path));
        } catch (e) {
          this.onChangeHandler(path);
        }
      })
      .on('unlink', this.onDeleteHandler);
  }

  public handlers(
    onAdd: (path: string) => void,
    onDelete: (path: string) => void,
    onChange: (path: string, itBlocks?: ItBlock[]) => void
  ) {
    this.onChangeHandler = onChange;
    this.onAddHandler = onAdd;
    this.onDeleteHandler = onDelete;
  }
}
