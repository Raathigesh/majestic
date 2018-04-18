import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import Button from '../primitive/button';
const { Eye, Play } = require('react-feather');

const Container = styled.div`
  display: flex;
`;

const RunTestContainer = styled.div`
  flex-grow: 1;
  margin-right: 10px;
`;

const WatchContainer = styled.div``;

interface RunPanelProps {
  isWatching: boolean;
  isExecuting: boolean;
  onRunTests: () => void;
  toggleWatch: () => void;
}

function RunPanel({
  onRunTests,
  isWatching,
  isExecuting,
  toggleWatch
}: RunPanelProps) {
  return (
    <Container>
      <RunTestContainer>
        <Button label="Run Tests" primary={true} icon={<Play size={16} />} />
      </RunTestContainer>
      <WatchContainer>
        <Button
          label="Watch"
          icon={<Eye size={16} />}
          onClick={() => {
            toggleWatch();
          }}
        />
      </WatchContainer>
    </Container>
  );
}

export default observer(RunPanel);
