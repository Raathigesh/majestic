import * as React from "react";
import TreeNode from "../stores/TreeNode";

export interface CodeViewerProps {
  node: TreeNode;
}

export default function CodeViewer({ node }: CodeViewerProps) {
  return (
    <div>
      {React.createElement("webview", {
        id: "foo",
        src: `file://${node.path}`,
        style: { height: "calc(100vh - 200px)" }
      })}
    </div>
  );
}
