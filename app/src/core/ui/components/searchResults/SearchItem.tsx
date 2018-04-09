import * as React from 'react';
import styled from 'styled-components';
import { Tooltip, Intent } from '@blueprintjs/core';

const Container = styled.div`
  padding: 5px !important;
  margin-top: 5px !important;
`;
const Header = styled.div`
  font-weight: 600;
`;
const Path = styled.div`
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface SearchItemProps {
  title: string;
  path: string;
  onClick: () => void;
}

export default function SearchItem({ title, path, onClick }: SearchItemProps) {
  return (
    <Container className="pt-card" onClick={onClick}>
      <Header>{title}</Header>
      <Tooltip content={path} className={'pt-dark'} intent={Intent.PRIMARY}>
        <Path>{path}</Path>
      </Tooltip>
    </Container>
  );
}
