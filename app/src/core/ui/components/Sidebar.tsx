import * as React from 'react';

import { observer } from 'mobx-react';
import styled from 'styled-components';
import Node from '../stores/Node';
import SearchResults from './searchResults';
import { Searcher } from '../stores/Searcher';
import { Tests } from '../stores/Tests';
import NewTree from './Tree';
import FileTreeOptions from './FileTreeOptions';

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
  private tree: NewTree | null;

  onTreeCollpse = () => {
    if (this.tree) {
      this.tree.recalculate();
    }
  };

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
          <FileTreeOptions tests={tests} onCollpse={this.onTreeCollpse} />
          {!searcher.isSearching && (
            <NewTree
              ref={tree => (this.tree = tree)}
              nodes={tests.nodes || []}
              onSearchItemClick={(node: Node) => {
                tests.changeCurrentSelection(node.path);
              }}
            />
          )}

          {searcher.isSearching && (
            <SearchResults
              items={searcher.results}
              onSearchItemClick={(node: Node) => {
                tests.changeCurrentSelection(node.path);
              }}
            />
          )}
        </Bottom>
      </Container>
    );
  }
}
