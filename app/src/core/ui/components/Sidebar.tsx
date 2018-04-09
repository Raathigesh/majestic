import * as React from 'react';

import { Tree } from '@blueprintjs/core';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import Workspace from '../stores/Workspace';
import Node from '../stores/Node';
import SearchResults from './searchResults';
const ObservedTree = observer(Tree);

const Container = styled.div`
  height: 100%;
  padding: 10px !important;
  background-color: #242850 !important;
`;

const SearchBox = styled.input`
  border-radius: 3px !important;
  background: rgba(151, 173, 187, 0.3) !important;
`;

interface TestsPanelProps {
  workspace: Workspace;
}

@observer
export default class TestsPanel extends React.Component<TestsPanelProps, {}> {
  public render() {
    const { workspace } = this.props;
    return (
      <Container className="pt-card pt-dark pt-small">
        <div className="pt-input-group">
          <span className="pt-icon pt-icon-search" />
          <SearchBox
            className="pt-input"
            type="text"
            placeholder="Search input"
            dir="auto"
            value={workspace.searcher.query}
            onChange={e => {
              workspace.searcher.setQuery(e.target.value);
            }}
          />
        </div>
        {!workspace.searcher.isSearching && (
          <ObservedTree
            contents={workspace.tests.nodes}
            onNodeClick={(node: Node) => {
              workspace.tests.changeCurrentSelection(node.path);
            }}
            onNodeCollapse={this.handleNodeCollapse}
            onNodeExpand={this.handleNodeExpand}
          />
        )}
        <SearchResults
          items={workspace.searcher.results}
          onSearchItemClick={(node: Node) => {
            workspace.tests.changeCurrentSelection(node.path);
            workspace.searcher.setQuery('');
          }}
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
