import * as React from 'react';

import { Tree } from '@blueprintjs/core';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import Workspace from '../stores/Workspace';
import Node from '../stores/Node';
const ObservedTree = observer(Tree);

const Container = styled.div`
  height: 100%;
  background-color: #0a0723 !important;
`;

interface TestsPanelProps {
  workspace: Workspace;
}

@observer
export default class TestsPanel extends React.Component<TestsPanelProps, {}> {
  public render() {
    const { workspace } = this.props;
    return (
      <Container className="pt-card pt-dark">
        <ObservedTree
          contents={workspace.tests.nodes}
          onNodeClick={(node: Node) => {
            workspace.tests.changeCurrentSelection(node.path);
          }}
          onNodeCollapse={this.handleNodeCollapse}
          onNodeExpand={this.handleNodeExpand}
        />
      </Container>
    );
  }

  private handleNodeCollapse = (nodeData: Node) => {
    nodeData.isExpanded = false;
  };

  private handleNodeExpand = (nodeData: Node) => {
    nodeData.isExpanded = true;
  };
}
