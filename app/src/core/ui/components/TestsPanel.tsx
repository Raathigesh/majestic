import * as React from 'react';
import styled from 'styled-components';
import Node from '../stores/Node';
import ItBlock from './ItBlock';

const Container = styled.div`
  height: 100%;
  background-color: #f5f9fc !important;
`;

const FileName = styled.div`
  font-size: 22px;
  color: #0a0723;
`;

const FilePath = styled.div`
  font-size: 17px;
  color: #0a0723;
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

interface TestPanelProps {
  testFile?: Node;
  onRunTest: () => void;
}

export default function TestPanel({ testFile, onRunTest }: TestPanelProps) {
  return (
    <Container className="pt-card pt-dark">
      <Header>
        <FileName>Spec.js</FileName>
        <FilePath>C:/projects/majestic/sample.spec</FilePath>
      </Header>
      {testFile &&
        testFile.itBlocks.map((itBlock, i) => (
          <ItBlock key={i} itBlock={itBlock} onRunTest={onRunTest} />
        ))}
    </Container>
  );
}
