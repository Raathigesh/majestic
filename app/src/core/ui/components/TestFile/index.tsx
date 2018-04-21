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

// tslint:disable:max-line-length
const Container = styled.div`
  height: 100%;
  padding: 0 !important;
  background-color: ${props => lighten(0.1, props.theme.main)} !important;
`;

const Tests = styled.div`
  margin-right: 10px;
  margin-left: 10px;
`;

interface TestPanelProps {
  testFile: Node;
  workspace: Workspace;
  onRunTest: (it: It) => void;
  onRunFile: () => void;
  onUpdateSnapshot: (it: It, testFileName: Node) => void;
  launchEditor: (it: It, testFileName: Node) => void;
  debugTest: (it: It, testFileName: Node) => void;
  isDebugging: boolean;
}

function TestFile({
  testFile,
  workspace,
  onRunTest,
  onRunFile,
  onUpdateSnapshot,
  launchEditor,
  debugTest,
  isDebugging
}: TestPanelProps) {
  return (
    <Container className="pt-card pt-dark">
      <Header testFile={testFile} workspace={workspace} onRunFile={onRunFile} />
      <Scrollbars style={{ height: 'calc(100vh - 128px)' }}>
        <Tests>
          {testFile &&
            testFile.itBlocks.map((itBlock, i) => (
              <ItBlock
                key={i}
                itBlock={itBlock}
                onRunTest={onRunTest}
                isDebugging={isDebugging}
                onUpdateSnapshot={() => {
                  onUpdateSnapshot(itBlock, testFile);
                }}
                launchInEditor={(it: It) => {
                  launchEditor(it, testFile);
                }}
                debugTest={() => {
                  debugTest(itBlock, testFile);
                }}
              />
            ))}
        </Tests>
      </Scrollbars>
    </Container>
  );
}

export default observer(TestFile);
