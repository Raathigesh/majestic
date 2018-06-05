import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import SelfBuildingSquareSpinner from '../spinners/SelfBuildingSquare';
const { Eye, EyeOff, Play } = require('react-feather');
import {
  ButtonGroup,
  Button,
  AnchorButton,
  Popover,
  Position,
  Switch
} from '@blueprintjs/core';
import { lighten } from 'polished';

const Container = styled.div`
  display: flex;
`;

const PlayButton = styled(Button)`
  background-color: ${props => props.theme.primary} !important;
`;

const WatchButton = styled(Button)`
  background-color: ${props => props.theme.secondary} !important;
  color: ${props => props.theme.main} !important;
`;

const MoreButton = styled(AnchorButton)`
  background-color: ${props => props.theme.secondary} !important;
  color: ${props => props.theme.main} !important;
`;

const ButtonPanel = styled(ButtonGroup)`
  width: 100%;
`;

const RunOptions = styled.div`
  background-color: ${props => lighten(0.2, props.theme.main)} !important;
  width: 300px;
  height: 100px;
  padding: 15px;
  border-radius: 5px;
`;

const RunOptionHeading = styled.div`
  margin-bottom: 10px;
  font-size: 14px;
`;

interface RunPanelProps {
  isWatching: boolean;
  isExecuting: boolean;
  isCoverageDisabled: boolean;
  onCoverageDisableChange: () => void;
  onRunTests: () => void;
  toggleWatch: () => void;
}

function RunPanel({
  onRunTests,
  isWatching,
  isExecuting,
  toggleWatch,
  isCoverageDisabled,
  onCoverageDisableChange
}: RunPanelProps) {
  const runLabel = isExecuting ? 'Stop' : 'Run';
  const watchLabel = isWatching ? 'Stop watching' : 'Watch';
  const WatchIcon = isWatching ? <EyeOff size={16} /> : <Eye size={16} />;
  const icon = isExecuting ? <SelfBuildingSquareSpinner /> : <Play size={16} />;
  return (
    <Container>
      <ButtonPanel fill={true} minimal={false}>
        <PlayButton
          icon={icon}
          onClick={() => {
            onRunTests();
          }}
        >
          {runLabel}
        </PlayButton>
        <WatchButton
          icon={WatchIcon}
          onClick={() => {
            toggleWatch();
          }}
        >
          {watchLabel}
        </WatchButton>
        <Popover
          position={Position.BOTTOM}
          content={
            <RunOptions>
              <RunOptionHeading>Additional run options</RunOptionHeading>
              <Switch
                checked={isCoverageDisabled}
                onChange={onCoverageDisableChange}
                label="Disable coverage collection"
              />
            </RunOptions>
          }
        >
          <MoreButton rightIcon="more" />
        </Popover>
      </ButtonPanel>
    </Container>
  );
}

export default observer(RunPanel);
