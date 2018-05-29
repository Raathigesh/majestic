import * as React from 'react';
const ReactVirtualized = require('react-virtualized');
import styled from 'styled-components';
import 'react-virtualized/styles.css';
import { observer } from 'mobx-react';
import { styledComponentWithProps } from '../util/styled';
import { Status } from '../stores/types/JestRepoter';
import { getColorForStatus } from '../theme';
import Node from '../stores/Node';
const { Scrollbars } = require('react-custom-scrollbars');
const { Tooltip } = require('react-tippy');

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

const StatusDotElement = styledComponentWithProps<
  {
    status: Status;
  },
  HTMLDivElement
>(styled.span);

const StatusDot = StatusDotElement`
color: ${props => getColorForStatus(props.status)};
`;

const ItemDivElement = styledComponentWithProps<
  {
    status: Status;
    selected: boolean;
  },
  HTMLDivElement
>(styled.div);

const ItemDiv = ItemDivElement`
  cursor: pointer;
  color: ${props => (props.selected ? props.theme.extra.mars : 'white')};
  display: flex;
  height: 20px;
  margin-left: ${props => (props.type === 'file' ? '5px' : '0px')}
  justify-content: space-between;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface ItemNodeProps {
  item: Node;
  onItemClick: any;
  onToggle: any;
}

@observer
class ItemNode extends React.Component<ItemNodeProps, any> {
  render(): any {
    const { item, onItemClick, onToggle } = this.props;
    var props: any = { key: item.path };
    var children: any = [];
    var itemText;

    if (item.isExpanded && item.children) {
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
        selected={item.isSelected || false}
        type={item.type}
        onClick={(event: any) => {
          event.stopPropagation();

          if (item.type !== 'directory') {
            onItemClick(item);
          } else {
            item.isExpanded = !item.isExpanded;
            onToggle();
          }
        }}
      >
        <div>
          <ItemSpan className={`pt-icon-standard ${toggleIcon}`} />
          <ItemSpan className={`pt-icon-standard ${icon}`} />
          {itemText}
          {item.type === 'file' &&
            item.status !== 'pending' && (
              <Tooltip
                title={item.status}
                position="right"
                trigger="mouseenter"
              >
                <StatusDot
                  status={item.status}
                  className="pt-icon-standard pt-icon-dot"
                />
              </Tooltip>
            )}
        </div>
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

  renderItem = (item: any) => {
    return (
      <ItemNode
        item={item}
        onItemClick={(clickedItem: any) => {
          this.props.onSearchItemClick(clickedItem);
        }}
        onToggle={() => {
          this.List.recomputeRowHeights();
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
    var renderedCell = this.renderItem(this.props.nodes[params.index]);
    return (
      <ul
        style={{ ...params.style, paddingLeft: '0px', margin: '0' }}
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
                height={params.height - 100}
                overscanRowCount={10}
                ref={(list: any) => (this.List = list)}
                rowHeight={this.rowHeight}
                rowRenderer={this.cellRenderer}
                rowCount={this.props.nodes.length}
                width={params.width - 30}
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
