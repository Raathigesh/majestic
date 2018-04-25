import * as React from 'react';
import styled from 'styled-components';
import Node from '../../stores/Node';
import InfoBlock from './InfoBlock';
import Button from '../button';
import { observer } from 'mobx-react';
const { Play } = require('react-feather');
import { Workspace } from '../../stores/Workspace';
import SelfBuildingSquareSpinner from '../spinners/SelfBuildingSquare';
import theme from '../../theme';
import { lighten } from 'polished';
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
  padding: 14px;
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

const RunFileButton = styled(Button)`
  border: 1.5px solid ${props => lighten(0.5, props.theme.main)};
  padding: 1px;
  min-width: 108px;
`;

function Header({ testFile, onRunFile, workspace }: HeaderProps) {
  const icon = workspace.isExecuting ? (
    <SelfBuildingSquareSpinner color={theme.text} />
  ) : (
    <Play size={16} />
  );
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
            color={theme.primary}
          />
          <InfoBlock
            icon="time"
            label={`${testFile.executionTime} ms`}
            color={theme.extra.mars}
          />
        </InfoBar>
      </Content>
      <RightContent>
        <RunFileButton
          label={workspace.isExecuting ? 'Stop' : 'Run File'}
          icon={icon}
          minimal={true}
          onClick={() => {
            onRunFile();
          }}
        />
      </RightContent>
    </Container>
  );
}

export default observer(Header);
