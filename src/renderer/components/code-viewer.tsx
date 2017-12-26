import * as React from "react";
import TreeNode from "../stores/TreeNode";

export interface CodeViewerProps {
  node: TreeNode;
  code: string;
  markers: any[];
}

export default function CodeViewer({ code, markers, node }: CodeViewerProps) {
  return (
    <div>
      {React.createElement("webview", {
        id: "foo",
        src: node.path,
        style: { height: "calc(100vh - 200px)" }
      })}
    </div>
  );
}
