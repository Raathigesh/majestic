import * as React from 'react';
import styled from 'styled-components';
import ExecutionSummary from '../../../stores/ExecutionSummary';
import { observer } from 'mobx-react';

const Container = styled.div`
  margin-bottom: 20px;
`;

interface RunTimeProps {
  executionSummary: ExecutionSummary;
}

function RunTime({ executionSummary }: RunTimeProps) {
  return (
    <Container>
      {executionSummary.timeTaken > 0 &&
        `Ran in ${executionSummary.timeTaken} seconds`}
    </Container>
  );
}

export default observer(RunTime);
