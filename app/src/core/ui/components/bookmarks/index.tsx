import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { lighten } from 'polished';

const FileItem = styled.div`
  padding: 3px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 3px;
  border-radius: 3px;
  background-color: ${props => lighten(0.1, props.theme.main)} !important;
  &:hover {
    background-color: ${props =>
      lighten(0.1, props.theme.extra.mars)} !important;
    color: ${props => props.theme.main} !important;
  }
`;

const Container = styled.div``;

const Title = styled.div`
  font-size: 16px;
  margin-bottom: 5px;
`;

interface BookmarksProps {
  bookmarks: Map<string, null>;
  onClick: (path: string) => void;
}

function Bookmarks({ bookmarks, onClick }: BookmarksProps) {
  return (
    <Container>
      {bookmarks.size > 0 && <Title>Bookmarks</Title>}
      {Array.from(bookmarks.keys()).map(path => {
        return (
          <FileItem
            key={path}
            onClick={() => {
              onClick(path);
            }}
          >
            {path}
          </FileItem>
        );
      })}
    </Container>
  );
}

export default observer(Bookmarks);
