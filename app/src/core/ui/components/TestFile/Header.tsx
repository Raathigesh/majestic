import * as React from 'react';
import styled from 'styled-components';
import Node from '../../stores/Node';
import InfoBlock from './InfoBlock';
import Button from '../button';
import { observer } from 'mobx-react';
const { Play } = require('react-feather');
import { Workspace } from '../../stores/Workspace';
import HollowDotsSpinner from '../summarPanel/HollowDotsSpinner';
import theme from '../../theme';
const Content = styled.div`
  flex-grow: 1;
`;

const RightContent = styled.div`
  align-items: center;
  display: flex;
`;

const FileName = styled.div`
  font-size: 22px;
  color: #0a0723;
  margin-bottom: 4px;
  color: ${props => props.theme.text} !important;
`;

const FilePath = styled.div`
  font-size: 14px;
  color: ${props => props.theme.text} !important;
  margin-bottom: 4px;
`;

const Container = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  padding: 20px;
`;

const InfoBar = styled.div`
  color: #0a0723;
  font-weight: 600;
  margin-top: 5px;
  font-size: 13px;
`;

interface HeaderProps {
  testFile: Node;
  workspace: Workspace;
  onRunFile: () => void;
}

function Header({ testFile, onRunFile, workspace }: HeaderProps) {
  return (
    <Container>
      <Content>
        <FileName>{testFile.label}</FileName>
        <FilePath>{testFile.path}</FilePath>
        <InfoBar>
          <InfoBlock
            icon="code"
            label={`${testFile.totalTests} Tests`}
            color={theme.extra.moon}
          />
          <InfoBlock
            icon="tick"
            label={`${testFile.totalPassedTests} Passed Tests`}
            color={theme.extra.mercury}
          />
          <InfoBlock
            icon="cross"
            label={`${testFile.totalFailedTests} Failed Tests`}
            color={theme.extra.mars}
          />
          <InfoBlock
            icon="time"
            label={`${testFile.executionTime} ms`}
            color="orange"
          />
        </InfoBar>
      </Content>
      <RightContent>
        <Button
          label="Run File"
          icon={<Play size={13} />}
          onClick={() => {
            onRunFile();
          }}
        >
          {workspace.isExecuting && <HollowDotsSpinner />}
        </Button>
      </RightContent>
    </Container>
  );
}

export default observer(Header);
