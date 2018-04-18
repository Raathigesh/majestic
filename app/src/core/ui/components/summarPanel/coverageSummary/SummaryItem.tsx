import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  margin-bottom: 25px;
  flex-direction: row;
`;
const StatsContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
`;
const StatCell = styled.div`
  flex-grow: 1;
  font-size: 20px;
`;
const StatLabel = styled.div`
  flex-grow: 1;
  font-size: 14px;
`;

interface SummaryItemProps {
  header: string;
  firstCount: number;
  secondCount: number;
  firstLabel: string;
  secondLabel: string;
}

export default function SummaryItem({
  header,
  firstCount,
  secondCount,
  firstLabel,
  secondLabel
}: SummaryItemProps) {
  return (
    <Container>
      <StatsContainer>
        <StatCell>{firstCount}</StatCell>
        <StatLabel>{firstLabel}</StatLabel>
      </StatsContainer>
      <StatsContainer>
        <StatCell>{secondCount}</StatCell>
        <StatLabel>{secondLabel}</StatLabel>
      </StatsContainer>
    </Container>
  );
}
