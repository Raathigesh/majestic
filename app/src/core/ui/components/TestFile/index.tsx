import * as React from 'react';
import styled from 'styled-components';
const { Scrollbars } = require('react-custom-scrollbars');
import { observer } from 'mobx-react';
import Node from '../../stores/Node';
import ItBlock from './itBlock';
import Header from './Header';
import It from '../../stores/It';
import { Workspace } from '../../stores/Workspace';
import { lighten } from 'polished';
import { VsCodeIntegrator } from '../../stores/VsCodeIntegrator';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 !important;
  flex-grow: 1;
  background-color: ${props => lighten(0.1, props.theme.main)} !important;
`;

const Tests = styled.div`
  flex-grow: 1;
  margin-right: 10px;
  margin-left: 10px;
`;

interface TestPanelProps {
  testFile: Node;
  workspace: Workspace;
  bookmarks: Map<string, null>;
  onRunTest: (it: It) => void;
  onRunFile: () => void;
  onUpdateSnapshot: (it: It, testFileName: Node) => void;
  launchEditor: (it: It, testFileName: Node) => void;
  debugTest: (testFileName: Node) => void;
  isDebugging: boolean;
  vsCodeIntegrator: VsCodeIntegrator;
}

function TestFile({
  testFile,
  workspace,
  onRunTest,
  onRunFile,
  onUpdateSnapshot,
  launchEditor,
  debugTest,
  isDebugging,
  vsCodeIntegrator,
  bookmarks
}: TestPanelProps) {
  return (
    <Container className="pt-card pt-dark">
      <Header
        testFile={testFile}
        workspace={workspace}
        onRunFile={onRunFile}
        bookmarks={bookmarks}
        debugTest={() => {
          debugTest(testFile);
        }}
      />
      <Scrollbars style={{ flexGrow: '1' }}>
        <Tests>
          {testFile &&
            testFile.itBlocks.map((itBlock, i) => (
              <ItBlock
                key={i}
                itBlock={itBlock}
                onRunTest={onRunTest}
                isDebugging={isDebugging}
                isVsCodeReady={vsCodeIntegrator.isDebuggerReady}
                onUpdateSnapshot={() => {
                  onUpdateSnapshot(itBlock, testFile);
                }}
                launchInEditor={(it: It) => {
                  launchEditor(it, testFile);
                }}
                startVsCodeDebug={(testName: string) => {
                  vsCodeIntegrator.startDebug(testName, testFile.path);
                }}
              />
            ))}
        </Tests>
      </Scrollbars>
    </Container>
  );
}

export default observer(TestFile);
