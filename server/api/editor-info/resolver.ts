import { Resolver, Query } from "type-graphql";
import { EditorInfo } from "./editor";
import { defaultEditor, allEditors } from "env-editor";
import { editors as supportedEditors } from "./supported-editors";

interface Editor {
  id: string;
  name: string;
  binary: string;
  isTerminalEditor: boolean;
  paths: Array<String>;
  keywords: Array<String>;
}

@Resolver(EditorInfo)
export default class EditorInfoResolver {
  private defaultEditor: Editor;
  private allEditors: Array<Editor>;

  constructor() {
    this.defaultEditor = defaultEditor() || {
      id: "code",
      name: "VS Code",
      binary: "code",
      isTerminalEditor: false,
      paths: [],
      keywords: []
    };
    allEditors().forEach(editor => {
      console.log({
        editor: editor,
        paths: editor.paths
      });
    });
    this.allEditors = allEditors().filter(
      (editor: Editor) =>
        editor.isTerminalEditor === false &&
        supportedEditors[editor.name] !== undefined &&
        editor.paths.length > 0
    );
  }

  @Query(returns => EditorInfo)
  editorInfo() {
    console.log({ all: this.allEditors });
    return {
      defaultEditor: this.defaultEditor,
      allEditors: this.allEditors
    };
  }
}
