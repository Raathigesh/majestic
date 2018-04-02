import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
`;

const RunTestContainer = styled.div`
  flex-grow: 1;
  margin-right: 10px;
`;

const WatchContainer = styled.div``;

interface RunPanelProps {
  onRunTests: () => void;
}

export default function RunPanel({ onRunTests }: RunPanelProps) {
  return (
    <Container>
      <RunTestContainer>
        <button
          type="button"
          onClick={() => {
            onRunTests();
          }}
          className="pt-button pt-fill pt-icon-play"
        >
          Run tests
        </button>
      </RunTestContainer>
      <WatchContainer>
        <button type="button" className="pt-button pt-icon-eye-open" />
      </WatchContainer>
    </Container>
  );
}
