import * as React from "react";
import styled, { keyframes } from "styled-components";
import { observer } from "mobx-react";
import ReactLoading from "react-loading";
import { Workspace } from "../../../stores/Workspace";
import Runner from "../../../stores/Runner";
import Output from "../../output";
import { styledComponentWithProps } from "../../../util/style";

const Container = styled.div`
  display: flex;
  height: 130px;
`;

const StatusBar = styled.div`
  font-weight: 450;
  font-size: 15px;
  display: flex;
  flex-direction: row;
  align-self: center;
  padding: 5px;
  margin-right: 10px;
  width: 100%;
`;

const ReactLoadingCustom = styled(ReactLoading)`
  height: 27px;
  width: 39px;
  margin-top: -8px;
  margin-right: 5px;
`;

const Title = styled.div`
  font-size: 17px;
`;

const BackgroundAnimation = keyframes`
    0%   {background: red;}
    25%  {background: black;}
    50%  {background: red;}
    75%  {background: black;}
    100% {background: red;}
`;

interface OutputIndicator {
  animate: boolean;
}

const ouputIndicatorDiv = styledComponentWithProps<
  OutputIndicator,
  HTMLDivElement
>(styled.div);

const OutputIndicator = ouputIndicatorDiv`
  font-size: 11px;
  margin-left: 5px;
  margin-top: 3px;
  padding: 2px 5px;
  color: white;
  background-color: #ced4dc;
  cursor: pointer;
  animation: ${BackgroundAnimation}
    ${props => (props.animate ? "3s infinite" : "0s")};
`;

const Row = styled.div`
  margin-top: 10px;
`;

const FileName = styled.span`
  font-size: 14px;
  color: #c44e58;
  word-wrap: break-word;
`;

const Header = styled.div`
  color: #556270;
  font-size: 12px;
`;

const InnerDiv = styled.div`
  width: 100%;
`;

export interface InfoProps {
  workspace: Workspace;
}

function getFileName(runner: Runner) {
  if (!runner) {
    return "...";
  }
  if (runner.watcherDetails.fileName) {
    return runner.watcherDetails.fileName;
  }

  return "...";
}

function getTestName(runner: Runner) {
  if (!runner) {
    return "...";
  }

  if (runner.watcherDetails.testName) {
    return runner.watcherDetails.testName;
  }

  if (!runner.watcherDetails.testName && runner.watcherDetails.fileName) {
    return "Watching all tests";
  }

  return "...";
}

function Info({ workspace }: InfoProps) {
  const { runner } = workspace;

  let displayText: JSX.Element | null | string = null;
  if (runner && runner.isRunning) {
    displayText = "Booting jest";
  } else if (runner && runner.isWatching) {
    displayText = "Watching for changes";
  }

  return (
    <Container>
      <InnerDiv>
        <StatusBar>
          {displayText && (
            <ReactLoadingCustom
              type="cylon"
              color="rgb(196, 77, 88)"
              height="21px"
              width="40px"
            />
          )}
          <Title>{displayText ? displayText : "⛱ Idling"}</Title>
          <Output workspace={workspace}>
            <OutputIndicator
              animate={runner && runner.isEmittingOutput}
              onClick={() => {
                workspace.showOutputPanel = !workspace.showOutputPanel;
              }}
            >
              Show Output
            </OutputIndicator>
          </Output>
        </StatusBar>
        <Row>
          <FileName>{getFileName(runner)}</FileName>
          <Header>File being watched</Header>
        </Row>
        <Row>
          <FileName>{getTestName(runner)}</FileName>
          <Header>Test being watched</Header>
        </Row>
      </InnerDiv>
    </Container>
  );
}

export default observer(Info);
