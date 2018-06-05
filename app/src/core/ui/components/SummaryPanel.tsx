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
import FailedTests from './summaryPanel/FailedTests';
import Bookmarks from './bookmarks';

const Container = styled.div`
  width: 350px;
  height: 100;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  background-color: ${props => props.theme.main} !important;
  box-shadow: none !important;
  color: ${props => props.theme.text} !important;
  padding-bottom: 0px !important;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
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
      <Body>
        <RunPanel
          onRunTests={() => {
            workspace.run();
            if (workspace.isExecuting) {
              tests.resetStatus();
            } else {
              tests.executeAllItBlocks();
            }
          }}
          isCoverageDisabled={workspace.diableCoverage}
          onCoverageDisableChange={() => {
            workspace.toggleCoverage();
          }}
          isWatching={workspace.watch}
          toggleWatch={() => {
            workspace.toggleWatch();
          }}
          isExecuting={workspace.isExecuting}
        />
        <ExecutionSummary
          executionSummary={tests.executionSummary}
          isRunning={workspace.isExecuting}
        />
        <CoverageSummary coverageSummary={tests.coverageSummary} />
        <Bookmarks
          bookmarks={workspace.bookmarks}
          onClick={(path: string) => {
            tests.changeCurrentSelection(path);
          }}
        />
        <FailedTests
          failedTetsts={tests.failedTests}
          onChangeCurrentSelection={tests.changeCurrentSelection}
        />
      </Body>
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
