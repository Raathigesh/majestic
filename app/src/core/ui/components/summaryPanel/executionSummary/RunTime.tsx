import * as React from 'react';
import styled from 'styled-components';
import ExecutionSummary from '../../../stores/ExecutionSummary';
import { observer } from 'mobx-react';

const Container = styled.div`
  margin-bottom: 20px;
`;

interface RunTimeProps {
  isRunning: boolean;
  executionSummary: ExecutionSummary;
}

function RunTime({ executionSummary, isRunning }: RunTimeProps) {
  const prefixText = isRunning ? 'Running for' : 'Ran for';
  return (
    <Container>
      {executionSummary.timeTaken > 0 &&
        `${prefixText} ${executionSummary.timeTaken} seconds`}
    </Container>
  );
}

export default observer(RunTime);
