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
  background-color: #0a0723 !important;
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
      />
      <ExecutionSummary executionSummary={workspace.tests.executionSummary} />
      <CoverageSummary />
    </Container>
  );
}

export default observer(SummaryPanel);
