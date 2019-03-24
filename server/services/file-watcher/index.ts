import { pubsub } from "../../event-emitter";
import { watch } from "fs";
import { createLogger } from "../../logger";

const log = createLogger("File watcher");

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
      log("Closed existing file watcher");
    }

    log("Watching file :", filePath);
    this.watcher = watch(filePath, () => {
      log("File changed", filePath);
      pubsub.publish(WatcherEvents.FILE_CHANGE, {
        id: WatcherEvents.FILE_CHANGE,
        payload: {
          path: filePath
        }
      });
    });
  }
}
