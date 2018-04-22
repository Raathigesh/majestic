import * as React from 'react';
import { observer } from 'mobx-react';
import Node from '../../stores/Node';
import SearchItem from './SearchItem';
import styled from 'styled-components';
const { Scrollbars } = require('react-custom-scrollbars');

const Container = styled.div``;

interface SearchResultsProps {
  items: Node[];
  onSearchItemClick: (node: Node) => void;
}

function SearchResults({ items, onSearchItemClick }: SearchResultsProps) {
  return (
    <Container>
      <Scrollbars style={{ height: 'calc(100vh - 62px)' }}>
        {items.map((item, i) => (
          <SearchItem
            key={i}
            title={item.label as string}
            path={item.path}
            onClick={() => {
              onSearchItemClick(item);
            }}
          />
        ))}
      </Scrollbars>
    </Container>
  );
}

export default observer(SearchResults);
