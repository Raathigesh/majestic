import * as React from 'react';
import styled from 'styled-components';
import SummaryItem from './SummaryItem';

const Header = styled.div`
  margin-bottom: 5px;
  display: flex;
  font-size: 15px;
  font-weight: 600;
`;
export default function CoverageSummary() {
  return (
    <div>
      <Header>
        <span>Coverage</span>
      </Header>
      <SummaryItem
        header="Test suits"
        firstLabel="Statement"
        secondLabel="Branch"
        firstCount={12}
        secondCount={56}
      />
      <SummaryItem
        header="Test suits"
        firstLabel="Statement"
        secondLabel="Branch"
        firstCount={12}
        secondCount={56}
      />
    </div>
  );
}
