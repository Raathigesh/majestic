import React from "react";
import styled from "styled-components";
import { space, fontSize, color } from "styled-system";
import { useSpring, animated } from "react-spring";
import { Shield, Folder, Code, Eye, Play } from "react-feather";
import Button from "../../components/button";

const Container = styled.div`
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

const FilePath = styled.div`
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
  isRunning: boolean;
  onRun: () => void;
  onWatch: () => void;
}

export default function FileSummary({
  path,
  isRunning,
  onRun,
  onWatch
}: Props) {
  return (
    <Container p={3} bg="slightDark">
      {isRunning && <ContainerBG />}
      <RightContainer>
        <FilePath fontSize={15} mb={2}>
          {path}
        </FilePath>
        <InfoContainer>
          <Info>
            <Folder size={14} /> <InfoLabel>10 Suites</InfoLabel>
          </Info>
          <Info>
            <Code size={14} /> <InfoLabel>10 Tests</InfoLabel>
          </Info>
        </InfoContainer>
      </RightContainer>
      <ActionPanel>
        <Button
          onClick={() => {
            onRun();
          }}
        >
          <Play size={14} /> Run
        </Button>
        <Button
          onClick={() => {
            onWatch();
          }}
        >
          <Eye size={14} />
          Run and watch
        </Button>
      </ActionPanel>
    </Container>
  );
}
