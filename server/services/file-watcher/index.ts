import * as chokidar from "chokidar";
import { pubsub } from "../../event-emitter";

export const WatcherEvents = {
  FILE_CHANGE: "FILE_CHANGE"
};

export interface FileChangeEvent {
  id: string;
  payload: {
    path: string;
  };
}

export default class FileWatcher {
  private watcher: any;

  watch(filePath: string) {
    if (this.watcher) {
      this.watcher.close();
    }
    this.watcher = chokidar.watch(filePath);
    this.watcher.on("change", () => {
      pubsub.publish(WatcherEvents.FILE_CHANGE, {
        id: WatcherEvents.FILE_CHANGE,
        payload: {
          path: filePath
        }
      });
    });

    return this.watcher;
  }
}
