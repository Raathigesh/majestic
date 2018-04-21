import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import Button from '../button';
import SelfBuildingSquareSpinner from '../spinners/SelfBuildingSquare';
const { Eye, EyeOff, Play } = require('react-feather');

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
  const runLabel = isExecuting ? 'Stop' : 'Run Tests';
  const watchLabel = isWatching ? 'Stop watching' : 'Watch changes';
  const WatchIcon = isWatching ? <EyeOff size={16} /> : <Eye size={16} />;
  const icon = isExecuting ? <SelfBuildingSquareSpinner /> : <Play size={16} />;
  return (
    <Container>
      <RunTestContainer>
        <Button
          label={runLabel}
          onClick={() => {
            onRunTests();
          }}
          primary={true}
          icon={icon}
        />
      </RunTestContainer>
      <WatchContainer>
        <Button
          label={watchLabel}
          icon={WatchIcon}
          onClick={() => {
            toggleWatch();
          }}
        />
      </WatchContainer>
    </Container>
  );
}

export default observer(RunPanel);
