import * as React from 'react';
import styled from 'styled-components';
import { styledComponentWithProps } from '../../../util/styled';

const Container = styled.div`
  margin-bottom: 20px;
`;
const StatsContainer = styled.div`
  display: flex;
`;
const StatCell = styled.div`
  flex-grow: 1;
  font-size: 20px;
`;

interface YourProps {
  type: string;
}
const div = styledComponentWithProps<YourProps, HTMLDivElement>(styled.div);
const StatLabel = div`
  flex-grow: 1;
  font-size: 12px;
  border-bottom: 1px solid ${props =>
    props.type === 'failure' ? '#b80000' : ' #00f900'};
`;

const Header = styled.div`
  margin-top: 5px;
  display: flex;
  font-size: 15px;
  font-weight: 500;
`;

interface SummaryItemProps {
  header: string;
  firstCount: number;
  secondCount: number;
}

export default function SummaryItem({
  header,
  firstCount,
  secondCount
}: SummaryItemProps) {
  return (
    <Container>
      <Header>
        <span>{header}</span>
      </Header>
      <StatsContainer>
        <StatCell>{firstCount}</StatCell>
        <StatCell>{secondCount}</StatCell>
      </StatsContainer>
      <StatsContainer>
        <StatLabel type="success">Success</StatLabel>
        <StatLabel type="failure">Failures</StatLabel>
      </StatsContainer>
    </Container>
  );
}
