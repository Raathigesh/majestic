import { Resolver, Mutation, Arg, Query } from "type-graphql";
import * as launch from "launch-editor";
import { App } from "./app";
import { OpenInEditor } from "../editor-info/editor";
import FileWatcher, { WatcherEvents } from "../../services/file-watcher";
import { pubsub } from "../../event-emitter";
import { dirname, basename } from "path";
import { editors } from "../editor-info/supported-editors";

const getEditorBinary = (name: string) => {
  return editors[name];
};

@Resolver(App)
export default class AppResolver {
  private appInstance: App;
  private fileWatcher: FileWatcher;
  private openInEditorResponse: OpenInEditor;

  constructor() {
    this.fileWatcher = new FileWatcher();
    this.appInstance = new App();
    this.openInEditorResponse = new OpenInEditor();
  }

  @Query(returns => App)
  app() {
    return this.appInstance;
  }

  @Mutation(returns => App)
  setSelectedFile(@Arg("path", { nullable: true }) path: string) {
    this.appInstance.selectedFile = path;

    if (path) {
      this.fileWatcher.watch(path);
      pubsub.publish(WatcherEvents.FILE_CHANGE, {
        id: WatcherEvents.FILE_CHANGE,
        payload: {
          path
        }
      });
    }

    return this.appInstance;
  }

  @Mutation(returns => OpenInEditor)
  async openInEditor(
    @Arg("path") path: string,
    @Arg("editor", { nullable: true }) editor: string
  ) {
    console.log({ editor });
    let openInEditorResponse = {
      status: "ok",
      message: ""
    };
    await launch(path, getEditorBinary(editor), (path: string, err: any) => {
      this.openInEditorResponse = {
        status: "fail",
        message: `Command ${getEditorBinary(
          editor
        )} not found in your path. Install it to open file in ${editor}`
      };
      console.error(
        `Command ${getEditorBinary(
          editor
        )} not found in your path. Install it to open file in ${editor}`
      );
    });
    return openInEditorResponse;
  }

 @Mutation(returns => String)
  openSnapInEditor(@Arg("path") path: string) {
    var dir = dirname(path)
    var file = basename(path);

    var snap = dir + '/__snapshots__/' + file + '.snap'
    console.log("opening the snapshot:", snap);
    this.openInEditor(snap);

    return "";
  }

  @Mutation(returns => String)

  openFailure(@Arg("failure") failure: string) {
    // The following regex matches the first line of the form: \w at <some text> (<file path>)
    // it captures <file path> and returns that in the second position of the match array
    let re = new RegExp('^\\s+at.*?\\((.*?)\\)$', 'm');
    let match = failure.match(re);
    if (match && match.length === 2) {
      const path = match[1];
      launch(path, process.env.EDITOR || "code", (path: string, err: any) => {
        console.log("Failed to open file in editor. You may need to install the code command to your PATH if you are using VSCode: ", err);
      });
    }
    else {
      console.log("Failed to find a path to a file to load in the failure string.");
    }
    return "";
  }
}
