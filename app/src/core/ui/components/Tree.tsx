import * as React from 'react';
const ReactVirtualized = require('react-virtualized');
import styled from 'styled-components';
import 'react-virtualized/styles.css';
import { observer } from 'mobx-react';
import { styledComponentWithProps } from '../util/styled';
import { Status } from '../stores/types/JestRepoter';
const { Scrollbars } = require('react-custom-scrollbars');

const ObservedList = observer(ReactVirtualized.List);

const ItemUl = styled.ul`
  padding-left: 15px;
  margin-top: 0;
  margin-bottom: 0;
  list-style: none;
  margin-bottom: '3px';
`;

const ItemSpan = styled.span`
  padding-right: 5px;
  font-size: 13px !important;
`;

const ItemDivElement = styledComponentWithProps<
  {
    status: Status;
    selected: boolean;
  },
  HTMLDivElement
>(styled.div);

function getLabelColor(status: string, selected: boolean, theme: any) {
  if (selected) {
    return theme.extra.mars;
  }

  if (status === 'passed') {
    return theme.extra.mercury;
  }

  return theme.secondary;
}

const ItemDiv = ItemDivElement`
  cursor: pointer;
  color: ${props => getLabelColor(props.status, props.selected, props.theme)};
  display: flex;
  height: 20px;
  margin-left: ${props => (props.type === 'file' ? '5px' : '0px')}
`;

@observer
class ItemNode extends React.Component<any, any> {
  render() {
    const { item, onItemClick, onToggle } = this.props;
    var props: any = { key: item.path };
    var children = [];
    var itemText;

    if (item.isExpanded) {
      children = item.children.map((child: any, index: any) => {
        return (
          <ItemNode
            key={child.path}
            item={child}
            onItemClick={onItemClick}
            onToggle={onToggle}
          />
        );
      });
    }

    itemText = item.label;

    const icon =
      item.type === 'directory' ? 'pt-icon-folder-close' : 'pt-icon-document';

    let toggleIcon = '';

    if (item.type === 'directory') {
      toggleIcon = item.isExpanded
        ? 'pt-icon-caret-down'
        : 'pt-icon-caret-right';
    }

    children.unshift(
      <ItemDiv
        className="item"
        key="label"
        status={item.status}
        selected={item.isSelected}
        type={item.type}
        onClick={(event: any) => {
          console.log(item);
          event.stopPropagation();
          item.isExpanded = !item.isExpanded;
          onToggle();

          if (item.type !== 'directory') {
            onItemClick(item);
          }
        }}
      >
        <ItemSpan className={`pt-icon-standard ${toggleIcon}`} />
        <ItemSpan className={`pt-icon-standard ${icon}`} />
        {itemText}
      </ItemDiv>
    );
    return (
      <ItemUl>
        <li {...props}>{children}</li>
      </ItemUl>
    );
  }
}

@observer
export default class Tree extends React.Component<any, any> {
  List: any;

  ROW_HEIGHT = 20;

  rowHeight = (params: any) => {
    return (
      this.getExpandedItemCount(this.props.nodes[params.index]) *
      this.ROW_HEIGHT
    );
  };

  renderItem = (item: any, keyPrefix: any) => {
    return (
      <ItemNode
        item={item}
        keyPrefix={keyPrefix}
        onItemClick={(clickedItem: any) => {
          this.props.onSearchItemClick(clickedItem);
        }}
        onToggle={() => {
          // this.List.recomputeRowHeights();
          this.List.forceUpdate();
        }}
      />
    );
  };

  getExpandedItemCount = (item: any) => {
    var totalcount = 1;

    if (item.isExpanded) {
      totalcount += item.children
        .map(this.getExpandedItemCount)
        .reduce((total: any, count: any) => {
          return total + count;
        }, 0);
    }

    return totalcount;
  };

  cellRenderer = (params: any) => {
    var renderedCell = this.renderItem(
      this.props.nodes[params.index],
      params.index
    );
    console.log(params.key);
    return (
      <ul
        style={{ ...params.style, paddingLeft: '0px' }}
        key={this.props.nodes[params.index].path}
      >
        {renderedCell}
      </ul>
    );
  };

  handleScroll = ({ target }: any) => {
    const { scrollTop, scrollLeft } = target;

    const { Grid: grid } = this.List;

    grid.handleScrollEvent({ scrollTop, scrollLeft });
  };

  render() {
    console.log(this.props.nodes.length);
    return (
      <Scrollbars style={{ height: 'calc(100vh - 62px)' }}>
        <ReactVirtualized.AutoSizer>
          {(params: any) => {
            return (
              <ObservedList
                height={params.height}
                overscanRowCount={10}
                ref={(list: any) => (this.List = list)}
                rowHeight={this.rowHeight}
                rowRenderer={this.cellRenderer}
                rowCount={this.props.nodes.length}
                width={params.width}
                style={{
                  overflowX: false,
                  overflowY: false
                }}
              />
            );
          }}
        </ReactVirtualized.AutoSizer>
      </Scrollbars>
    );
  }
}
