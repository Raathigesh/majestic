import * as React from 'react';
import { observer } from 'mobx-react';
import Empty from './Empty';
import { Workspace, Debugger, Tests, Node } from '../stores';
import It from '../stores/It';
import TestFile from './testFile';
import Tab from './tab';
import styled from 'styled-components';
import { VsCodeIntegrator } from '../stores/VsCodeIntegrator';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

interface MiddlePanelProps {
  workspace: Workspace;
  tests: Tests;
  debug: Debugger;
  vsCodeIntegrator: VsCodeIntegrator;
}

function MiddlePanel({
  workspace,
  tests,
  debug,
  vsCodeIntegrator
}: MiddlePanelProps) {
  return (
    <Container>
      {tests.selectedTest && (
        <TestFile
          testFile={tests.selectedTest}
          workspace={workspace}
          onRunTest={(it: It) => {
            if (!tests.selectedTest) {
              return;
            }
            workspace.runTest(tests.selectedTest, it);
          }}
          onRunFile={() => {
            workspace.runFile(tests.selectedTest);
          }}
          onUpdateSnapshot={workspace.updateSnapshot}
          launchEditor={(it: It, testFileName: Node) => {
            debug.launchInEditor(testFileName, it);
            vsCodeIntegrator.goToTest(testFileName.path, it.line);
          }}
          debugTest={(testFileName: Node) => {
            debug.startDebugging(testFileName);
          }}
          isDebugging={debug.running}
          vsCodeIntegrator={vsCodeIntegrator}
          bookmarks={workspace.bookmarks}
        />
      )}
      {!tests.selectedTest && <Empty />}
      {tests.selectedTest && <Tab debug={debug} />}
    </Container>
  );
}

export default observer(MiddlePanel);
