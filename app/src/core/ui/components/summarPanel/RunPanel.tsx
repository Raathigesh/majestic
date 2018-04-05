import * as React from 'react';
import styled from 'styled-components';
import { Button } from '@blueprintjs/core';
import { observer } from 'mobx-react';
const classnames = require('classnames');

const Container = styled.div`
  display: flex;
`;

const RunTestContainer = styled.div`
  flex-grow: 1;
  margin-right: 10px;
`;

const WatchContainer = styled.div``;
const MainButton = styled.button`
  background-color: white !important;
  color: #252950 !important;
  border-radius: 0px !important;

  &:hover {
    background-color: #242850 !important;
    color: white !important;
  }

  &::before {
    color: #242850 !important;
  }
`;

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
        <MainButton
          type="button"
          onClick={() => {
            onRunTests();
          }}
          className={classnames('pt-button pt-fill', {
            'pt-icon-stop': isExecuting,
            'pt-icon-play': !isExecuting
          })}
        >
          {isExecuting ? 'Stop' : 'Run all tests'}
        </MainButton>
      </RunTestContainer>
      <WatchContainer>
        <Button
          className="pt-button pt-icon-eye-open"
          active={isWatching}
          onClick={() => {
            toggleWatch();
          }}
        />
      </WatchContainer>
    </Container>
  );
}

export default observer(RunPanel);
