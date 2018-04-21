import * as React from 'react';
import styled from 'styled-components';
const { File } = require('react-feather');
import { styledComponentWithProps } from '../../util/styled';
import { getColorForStatus } from '../../theme';
import { Status } from '../../stores/types/JestRepoter';

const ContainerSpan = styledComponentWithProps<
  {
    status: Status;
  },
  HTMLDivElement
>(styled.span);

const Container = ContainerSpan`
  background-color: ${props => getColorForStatus(props.status)};
  color: white;
  font-size: 11px;
  border-radius: 13px;
  width: 58px;
  padding-right: 13px;
  padding-left: 13px;
  font-weight: 600;
  font-size: 13px;
`;

interface LabelProps {
  status: Status;
}

function Label({ status }: LabelProps) {
  const text = status === 'passed' ? 'Pass' : 'Fail';
  return <Container status={status}>{text}</Container>;
}

export function getLabel(status: Status) {
  return <Label status={status} />;
}

export function getTreeIcon() {
  return <File size={14} />;
}
