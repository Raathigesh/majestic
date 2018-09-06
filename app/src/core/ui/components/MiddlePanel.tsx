import * as React from 'react';
import { observer } from 'mobx-react';
import Empty from './Empty';
import { Workspace, Debugger, Tests, Node } from '../stores';
import It from '../stores/It';
import TestFile from './testFile';
import Tab from './tab';
import styled from 'styled-components';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

interface MiddlePanelProps {
  workspace: Workspace;
  tests: Tests;
  debug: Debugger;
}

function MiddlePanel({ workspace, tests, debug }: MiddlePanelProps) {
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
          }}
          debugTest={(testFileName: Node) => {
            debug.startDebugging(testFileName);
          }}
          isDebugging={debug.running}
          bookmarks={workspace.bookmarks}
        />
      )}
      {!tests.selectedTest && <Empty />}
      {tests.selectedTest && <Tab debug={debug} />}
    </Container>
  );
}

export default observer(MiddlePanel);
