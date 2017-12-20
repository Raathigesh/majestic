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
      {/* <FileCoverage node={node} /> */}
      {/* <AceEditor
        mode="javascript"
        theme="solarized_light"
        onChange={() => {}}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        value={code}
        markers={markers}
        width="100%"
        height="calc(100vh - 250px)"
        fontSize={14}
      /> */}
      <webview
        id="foo"
        src={node.path}
        style={{ height: "calc(100vh - 200px)" }}
      />
    </div>
  );
}
