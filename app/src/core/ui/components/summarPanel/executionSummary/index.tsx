import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import SummaryItem from './SummaryItem';
import RunTime from './RunTime';
import ExecutionSummaryStore from '../../../stores/ExecutionSummary';

const Container = styled.div`
  margin-top: 15px;
`;

interface ExecutionSummaryProps {
  executionSummary: ExecutionSummaryStore;
}

function ExecutionSummary({ executionSummary }: ExecutionSummaryProps) {
  return (
    <Container>
      <RunTime executionSummary={executionSummary} />
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
