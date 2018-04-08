import * as React from 'react';
import styled from 'styled-components';
const { Scrollbars } = require('react-custom-scrollbars');
import { observer } from 'mobx-react';
import Node from '../../stores/Node';
import ItBlock from '../ItBlock';
import Header from './Header';
import It from '../../stores/It';

const Container = styled.div`
  height: 100%;
  background-color: #f5f9fc !important;
`;

const Tests = styled.div`
  margin-right: 10px;
`;

interface TestPanelProps {
  testFile: Node;
  onRunTest: (it: It) => void;
  onRunFile: () => void;
}

function TestFile({ testFile, onRunTest, onRunFile }: TestPanelProps) {
  return (
    <Container className="pt-card pt-dark">
      <Header testFile={testFile} onRunFile={onRunFile} />
      <Scrollbars style={{ height: 'calc(100vh - 128px)' }}>
        <Tests>
          {testFile &&
            testFile.itBlocks.map((itBlock, i) => (
              <ItBlock key={i} itBlock={itBlock} onRunTest={onRunTest} />
            ))}
        </Tests>
      </Scrollbars>
    </Container>
  );
}

export default observer(TestFile);
