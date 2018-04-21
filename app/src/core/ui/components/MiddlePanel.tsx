import * as React from 'react';
import { observer } from 'mobx-react';
import Empty from './Empty';
import { Workspace, Debugger, Tests, Node } from '../stores';
import It from '../stores/It';
import TestFile from './testFile';

interface MiddlePanelProps {
  workspace: Workspace;
  tests: Tests;
  debug: Debugger;
}

function MiddlePanel({ workspace, tests, debug }: MiddlePanelProps) {
  return (
    <React.Fragment>
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
          debugTest={(it: It, testFileName: Node) => {
            debug.startDebugging(testFileName, it);
          }}
          isDebugging={debug.running}
        />
      )}
      {!tests.selectedTest && <Empty />}
    </React.Fragment>
  );
}

export default observer(MiddlePanel);
