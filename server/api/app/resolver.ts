import { Resolver, Mutation, Arg, Query } from "type-graphql";
import * as launch from "launch-editor";
import { App } from "./app";
import FileWatcher, { WatcherEvents } from "../../services/file-watcher";
import { pubsub } from "../../event-emitter";

@Resolver(App)
export default class AppResolver {
  private appInstance: App;
  private fileWatcher: FileWatcher;

  constructor() {
    this.fileWatcher = new FileWatcher();
    this.appInstance = new App();
  }

  @Query(returns => App)
  app() {
    return this.appInstance;
  }

  @Mutation(returns => App)
  setSelectedFile(@Arg("path") path: string) {
    this.appInstance.selectedFile = path;
    this.fileWatcher.watch(path);

    pubsub.publish(WatcherEvents.FILE_CHANGE, {
      id: WatcherEvents.FILE_CHANGE,
      payload: {
        path
      }
    });

    return this.appInstance;
  }

  @Mutation(returns => String)
  openInEditor(@Arg("path") path: string) {
    launch(path, "code", (path: string, err: any) => {
      console.log("Failed to open file in editor: ", err);
    });

    return "";
  }
}
