import * as React from 'react';
import styled from 'styled-components';
import { styledComponentWithProps } from '../../util/styled';

interface InfoBlockProps {
  label: string;
  icon: string;
  color: string;
}

const Container = styled.span`
  margin-right: 15px;
`;

const IconSpan = styledComponentWithProps<
  {
    color: string;
  },
  HTMLSpanElement
>(styled.span);

const Icon = IconSpan`
  &::before {
    font-size: 14px;
    color: ${props => props.color}
  }

  margin-right: 3px;
`;

export default function InfoBlock({ label, icon, color }: InfoBlockProps) {
  return (
    <Container>
      <Icon className={`pt-icon-standard pt-icon-${icon}`} color={color} />
      {label}
    </Container>
  );
}
