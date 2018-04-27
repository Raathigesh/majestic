import * as React from 'react';

import { Tree } from '@blueprintjs/core';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import Node from '../stores/Node';
import SearchResults from './searchResults';
import { Searcher } from '../stores/Searcher';
import { Tests } from '../stores/Tests';
const { Scrollbars } = require('react-custom-scrollbars');
const ObservedTree = observer(Tree);

const Container = styled.div`
  height: 100%;
  padding: 10px !important;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.main} !important;
`;

const SearchContainer = styled.div``;
const Bottom = styled.div`
  flex-grow: 1;
`;

const SearchBox = styled.input`
  border-radius: 3px !important;
  background: rgba(151, 173, 187, 0.3) !important;
  margin-bottom: 10px;
`;

interface TestsPanelProps {
  tests: Tests;
  searcher: Searcher;
}

@observer
export default class TestsPanel extends React.Component<TestsPanelProps, {}> {
  public render() {
    const { searcher, tests } = this.props;
    return (
      <Container className="pt-card pt-dark pt-small">
        <SearchContainer>
          <div className="pt-input-group">
            <span className="pt-icon pt-icon-search" />
            <SearchBox
              className="pt-input"
              type="text"
              placeholder="Search tests"
              dir="auto"
              value={searcher.query}
              onChange={e => {
                searcher.setQuery(tests.flatNodeMap, e.target.value);
              }}
            />
          </div>
        </SearchContainer>
        <Bottom>
          {!searcher.isSearching && (
            <Scrollbars style={{ height: 'calc(100vh - 62px)' }}>
              <ObservedTree
                contents={tests.nodes}
                onNodeClick={(node: Node) => {
                  tests.changeCurrentSelection(node.path);
                }}
                onNodeCollapse={this.handleNodeCollapse}
                onNodeExpand={this.handleNodeExpand}
              />
            </Scrollbars>
          )}

          <SearchResults
            items={searcher.results}
            onSearchItemClick={(node: Node) => {
              tests.changeCurrentSelection(node.path);
              searcher.setQuery(tests.flatNodeMap, '');
            }}
          />
        </Bottom>
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
