import React, { Component } from "react";
import "../../style-override/override.less";
import TreeViewStore from "../../store/tree";
import styled, { css, injectGlobal } from "react-emotion";
import { inject, observer } from "mobx-react";
import TreeNodeStore from "../../store/tree-node";
import ActionPanel from "./action-panel";
import CustomNode from "./node";

const Container = styled("div")`
  padding-left: 5px;
  min-width: 350px;
  background-color: #09141c;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

interface Props {
  tree?: TreeViewStore;
}

@inject("tree")
@observer
export default class Outline extends Component<Props> {
  render() {
    const { tree } = this.props;
    if (!tree) return null;
    return (
      <Container>
        <ActionPanel />
        {tree.nodes.length && (
          <CustomNode
            root={tree.nodes[0]}
            highlightComponent={tree.highlightComponentInPreview}
          />
        )}
      </Container>
    );
  }
}
