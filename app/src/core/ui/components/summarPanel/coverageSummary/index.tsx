import * as React from 'react';
import styled from 'styled-components';
import SummaryItem from './SummaryItem';
import Summary from '../../../stores/CoverageSummary';
import { observer } from 'mobx-react';

const Header = styled.div`
  margin-bottom: 5px;
  display: flex;
  font-size: 15px;
  font-weight: 600;
`;

interface CoverageSummaryProps {
  coverageSummary: Summary;
}

function CoverageSummary({ coverageSummary }: CoverageSummaryProps) {
  return (
    <div>
      <Header>
        <span>Coverage</span>
      </Header>
      <SummaryItem
        header="Test suits"
        firstLabel="Statement"
        secondLabel="Line"
        firstCount={coverageSummary.statementPercentage}
        secondCount={coverageSummary.linePercentage}
      />
      <SummaryItem
        header="Test suits"
        firstLabel="function"
        secondLabel="Branch"
        firstCount={coverageSummary.functionPercentage}
        secondCount={coverageSummary.branchesPercentage}
      />
    </div>
  );
}

export default observer(CoverageSummary);
