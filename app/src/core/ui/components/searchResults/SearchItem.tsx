import * as React from 'react';
import styled from 'styled-components';
import { lighten } from 'polished';

const Container = styled.div`
  padding: 8px !important;
  margin-top: 5px !important;
  cursor: pointer;
  border-radius: 3px;
  background-color: ${props => lighten(0.2, props.theme.main)};
  &:hover {
    background-color: ${props => lighten(0.1, props.theme.main)};
  }
`;

const Header = styled.div`
  font-weight: 600;
`;
const Path = styled.div`
  font-size: 12px;
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
    <Container onClick={onClick}>
      <Header>{title}</Header>
      <Path>{path}</Path>
    </Container>
  );
}
