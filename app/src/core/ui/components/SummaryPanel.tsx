import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import RunPanel from './summarPanel/RunPanel';
import ExecutionSummary from './summarPanel/executionSummary';
import CoverageSummary from './summarPanel/coverageSummary';
import { Workspace } from '../stores/Workspace';
import { Tests } from '../stores/Tests';

const Container = styled.div`
  width: 350px;
  height: 100;
  background-color: ${props => props.theme.main} !important;
  box-shadow: none !important;
  color: ${props => props.theme.text} !important;
`;

interface SummaryPanelProps {
  workspace: Workspace;
  tests: Tests;
}

function SummaryPanel({ workspace, tests }: SummaryPanelProps) {
  return (
    <Container className="pt-card pt-dark">
      <RunPanel
        onRunTests={() => {
          workspace.run();
        }}
        isWatching={workspace.watch}
        toggleWatch={() => {
          workspace.toggleWatch();
        }}
        isExecuting={workspace.isExecuting}
      />
      <ExecutionSummary executionSummary={tests.executionSummary} />
      <CoverageSummary />
    </Container>
  );
}

export default observer(SummaryPanel);
