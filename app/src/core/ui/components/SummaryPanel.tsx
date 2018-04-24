import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import RunPanel from './summaryPanel/RunPanel';
import ExecutionSummary from './summaryPanel/executionSummary';
import CoverageSummary from './summaryPanel/coverageSummary';
import Footer from './summaryPanel/Footer';
import { Workspace } from '../stores/Workspace';
import { Tests } from '../stores/Tests';
import { Preference as PreferenceStore, Updater } from '../stores';
import Preference from './Preference';

const Container = styled.div`
  width: 350px;
  height: 100;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  background-color: ${props => props.theme.main} !important;
  box-shadow: none !important;
  color: ${props => props.theme.text} !important;
`;

interface SummaryPanelProps {
  workspace: Workspace;
  tests: Tests;
  preference: PreferenceStore;
  updater: Updater;
}

function SummaryPanel({
  workspace,
  tests,
  preference,
  updater
}: SummaryPanelProps) {
  return (
    <Container className="pt-card pt-dark">
      <div>
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
        {tests.coverageSummary.isCoverageAvailable && (
          <CoverageSummary coverageSummary={tests.coverageSummary} />
        )}
      </div>
      <Footer
        version={updater.version}
        onPreferenceClick={() => {
          preference.togglePreferenceModal(true);
        }}
      />
      <Preference preference={preference} />
    </Container>
  );
}

export default observer(SummaryPanel);
