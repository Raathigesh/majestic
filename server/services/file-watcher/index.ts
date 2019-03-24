import { pubsub } from "../../event-emitter";
import { watch } from "fs";

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

    this.watcher = watch(filePath, () => {
      pubsub.publish(WatcherEvents.FILE_CHANGE, {
        id: WatcherEvents.FILE_CHANGE,
        payload: {
          path: filePath
        }
      });
    });
  }
}
