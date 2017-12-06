import * as React from "react";
import { ITreeNode, Tree } from "@blueprintjs/core";
import { observer } from "mobx-react";
import styled from "styled-components";

import { Workspace } from "../stores/Workspace";

let ObserverTree = observer(Tree);
const StyledObserverTree = styled(ObserverTree)`
  flex-grow: 1;
`;

function TreeView({
  workspace,
  files
}: {
  files: any[];
  workspace: Workspace;
}) {
  return (
    <StyledObserverTree
      contents={files}
      onNodeExpand={(nodeData: ITreeNode) => {
        nodeData.isExpanded = true;
      }}
      onNodeCollapse={(nodeData: ITreeNode) => {
        nodeData.isExpanded = false;
      }}
      onNodeClick={(event: ITreeNode) => {
        workspace.selectFile((event as any).path);
      }}
    />
  );
}

export default observer(TreeView);
