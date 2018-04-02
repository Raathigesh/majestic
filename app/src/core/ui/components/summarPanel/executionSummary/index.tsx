import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import SummaryItem from './SummaryItem';
import ExecutionSummaryStore from '../../../stores/ExecutionSummary';

const Container = styled.div`
  margin-top: 15px;
  margin-bottom: 40px;
`;

interface ExecutionSummaryProps {
  executionSummary: ExecutionSummaryStore;
}

function ExecutionSummary({ executionSummary }: ExecutionSummaryProps) {
  return (
    <Container>
      <SummaryItem
        header="Test suits"
        firstCount={executionSummary.successfulSuits}
        secondCount={executionSummary.failedSuits}
      />
      <SummaryItem
        header="Tests"
        firstCount={executionSummary.successfulTests}
        secondCount={executionSummary.failedTests}
      />
      <SummaryItem
        header="Snapshots"
        firstCount={executionSummary.successfulSnaphots}
        secondCount={executionSummary.failedSnaphots}
      />
    </Container>
  );
}

export default observer(ExecutionSummary);
