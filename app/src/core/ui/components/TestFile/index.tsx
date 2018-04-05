import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import Node from '../../stores/Node';
import ItBlock from '../ItBlock';
import Header from './Header';

const Container = styled.div`
  height: 100%;
  background-color: #f5f9fc !important;
`;

interface TestPanelProps {
  testFile: Node;
  onRunTest: () => void;
  onRunFile: () => void;
}

function TestFile({ testFile, onRunTest, onRunFile }: TestPanelProps) {
  return (
    <Container className="pt-card pt-dark">
      <Header testFile={testFile} onRunFile={onRunFile} />
      {testFile &&
        testFile.itBlocks.map((itBlock, i) => (
          <ItBlock key={i} itBlock={itBlock} onRunTest={onRunTest} />
        ))}
    </Container>
  );
}

export default observer(TestFile);
