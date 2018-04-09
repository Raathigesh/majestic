import * as React from 'react';
import { observer } from 'mobx-react';
import Node from '../../stores/Node';
import SearchItem from './SearchItem';

interface SearchResultsProps {
  items: Node[];
  onSearchItemClick: (node: Node) => void;
}

function SearchResults({ items, onSearchItemClick }: SearchResultsProps) {
  return (
    <div>
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
    </div>
  );
}

export default observer(SearchResults);
