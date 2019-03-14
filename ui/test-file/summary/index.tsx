import React from "react";
import styled from "styled-components";
import { space, fontSize, color } from "styled-system";
import { useSpring, animated } from "react-spring";
import {
  Shield,
  Folder,
  Code,
  Eye,
  Play,
  StopCircle,
  Camera,
  CheckCircle,
  XCircle
} from "react-feather";
import Button from "../../components/button";
import { Tooltip } from "react-tippy";

const Container = styled.div<any>`
  position: relative;
  ${space};
  ${color};
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  overflow: hidden;
`;

const ContainerBG = styled(animated.div)`
  @keyframes MOVE-BG {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(27px);
    }
  }
  border-radius: 3px;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: -46px;
  background: repeating-linear-gradient(
    45deg,
    #404148,
    #404148 10px,
    #242326 10px,
    #242326 20px
  );

  animation-name: MOVE-BG;
  animation-duration: 0.5s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
`;

const RightContainer = styled.div`
  z-index: 1;
`;

const InfoContainer = styled.div`
  display: flex;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  margin-right: 15px;
`;

const InfoLabel = styled.div`
  margin-left: 5px;
`;

const FilePath = styled.div<any>`
  ${fontSize};
  ${space};
  font-weight: 600;
`;

const ActionPanel = styled.div`
  display: flex;
  align-items: center;
  z-index: 1;
`;

interface Props {
  path: string;
  projectRoot: string;
  suiteCount: number;
  testCount: number;
  passingTests: number;
  failingTests: number;
  isRunning: boolean;
  onRun: () => void;
  onStop: () => void;
  onSnapshotUpdate: () => void;
  haveSnapshotFailures: boolean;
}

export default function FileSummary({
  path,
  projectRoot,
  suiteCount,
  testCount,
  passingTests,
  failingTests,
  isRunning,
  onRun,
  onStop,
  onSnapshotUpdate,
  haveSnapshotFailures
}: Props) {
  const Icon = isRunning ? StopCircle : Play;

  return (
    <Container p={4} bg="slightDark">
      {isRunning && <ContainerBG />}
      <RightContainer>
        <FilePath fontSize={15} mb={2}>
          {path.replace(projectRoot, "")}
        </FilePath>
        <InfoContainer>
          <Info>
            <Folder size={14} /> <InfoLabel>{suiteCount} Suites</InfoLabel>
          </Info>
          <Info>
            <Code size={14} /> <InfoLabel>{testCount} Tests</InfoLabel>
          </Info>
          <Info>
            <CheckCircle size={14} />{" "}
            <InfoLabel>{passingTests} Passing tests</InfoLabel>
          </Info>
          <Info>
            <XCircle size={14} />{" "}
            <InfoLabel>{failingTests} Failing tests</InfoLabel>
          </Info>
        </InfoContainer>
      </RightContainer>
      <ActionPanel>
        <Tooltip title="Run file" position="bottom" size="small">
          <Button
            icon={<Icon size={14} />}
            minimal
            onClick={() => {
              if (isRunning) {
                onStop();
              } else {
                onRun();
              }
            }}
          >
            {isRunning ? "Stop" : "Run"}
          </Button>
        </Tooltip>
        {haveSnapshotFailures && (
          <Tooltip
            title="Update all snapshots of the file"
            position="bottom"
            size="small"
          >
            <Button
              minimal
              icon={<Camera size={14} />}
              onClick={() => {
                onSnapshotUpdate();
              }}
            >
              Update Snapshot
            </Button>
          </Tooltip>
        )}
      </ActionPanel>
    </Container>
  );
}
