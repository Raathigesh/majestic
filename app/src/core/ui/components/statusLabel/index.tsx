import * as React from 'react';
import styled from 'styled-components';
import { styledComponentWithProps } from '../../util/styled';

const ContainerSpan = styledComponentWithProps<
  {
    status: string;
  },
  HTMLDivElement
>(styled.span);

const Container = ContainerSpan`
  background-color: ${props =>
    props.status === 'pass' ? '#0ed10e' : '#e93e28'};
  color: white;
  font-size: 11px;
  border-radius: 13px;
  width: 58px;
  padding-right: 13px;
  padding-left: 13px;
`;

interface LabelProps {
  status: string;
}

function Label({ status }: LabelProps) {
  const text = status === 'pass' ? 'Pass' : 'Fail';
  return <Container status={status}>{text}</Container>;
}

export function getLabel(status: string) {
  return <Label status={status} />;
}
