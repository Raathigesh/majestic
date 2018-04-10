import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import RunPanel from './summarPanel/RunPanel';
import ExecutionSummary from './summarPanel/executionSummary';
import CoverageSummary from './summarPanel/coverageSummary';
import Workspace from '../stores/Workspace';

const Container = styled.div`
  width: 400px;
  height: 100;
  background-color: #f7fbff !important;
  box-shadow: none !important;
  color: #25294f !important;
`;

interface SummaryPanelProps {
  workspace: Workspace;
}

function SummaryPanel({ workspace }: SummaryPanelProps) {
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
      <ExecutionSummary executionSummary={workspace.tests.executionSummary} />
      <CoverageSummary />
    </Container>
  );
}

export default observer(SummaryPanel);
