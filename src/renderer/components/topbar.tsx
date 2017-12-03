import * as React from "react";
import styled from "styled-components";
import ReactLoading from "react-loading";
import { Switch } from "@blueprintjs/core";
import { Workspace } from "../stores/Workspace";
import TestSummary from "./topbar/test-summary";
import TestCoverage from "./topbar/test-coverage";
import { observer } from "mobx-react";
import cn from "classnames";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #fbf9ff;
  padding: 10px;
`;

const StatusBar = styled.div`
  font-weight: 450;
  font-size: 12px;
  display: flex;
  flex-direction: row;
  align-self: center;
  margin-left: 10px;
  background-color: #fff8e9;
  padding: 5px;
  border-radius: 3px;
  border: 1px solid #ffe9bf;
  width: 100%;
  margin-left: 10px;
  margin-right: 10px;
`;
const StatusText = styled.div`
  margin-top: 2px;
  margin-left: 10px;
  color: #926106;
`;

const BasicContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-right: 20px;
  border-right: 1px solid #d3d8dd;
  padding-right: 20px;
  max-width: 310px;
`;
const ReactLoadingCustom = styled(ReactLoading)`
  margin-top: -5px;
`;

const TestSummaryContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  margin-right: 10px;
  margin-left: 10px;
  margin-right: 20px;
  border-right: 1px solid #d3d8dd;
  padding-right: 20px;
  max-width: 310px;
`;

const CoverageSummary = styled.div`
  flex-grow: 1;
  max-width: 310px;
`;

const WatchModeToggle = styled(Switch)`
  margin-top: 8px;
  margin-bottom: 0px;
  margin-left: 10px;
`;

export interface TopbarProps {
  workspace: Workspace;
  onPreferenceToggle: () => void;
}

function runButonLabel(isRunning, isWatching) {
  if (isWatching) {
    return isRunning ? "Running" : "Rerun all tests";
  } else {
    return isRunning ? "Running" : "Run all tests";
  }
}

function Topbar({ workspace, onPreferenceToggle }: TopbarProps) {
  const isRunning = workspace.runner && workspace.runner.isRunning;
  const isWatching = workspace.runner && workspace.runner.isWatching;

  return (
    <Container>
      <BasicContent>
        <div>
          <div className="pt-button-group pt-minimal pt-fill">
            <a
              className={cn("pt-button  pt-minimal pt-icon-play", {
                "pt-disabled": isRunning
              })}
              onClick={() => {
                workspace.runProject(false);
              }}
            >
              {runButonLabel(isRunning, isWatching)}
            </a>
            <a
              className={cn("pt-button pt-icon-stop", {
                "pt-disabled": !isRunning && !isWatching
              })}
              onClick={() => {
                workspace.stop();
              }}
            />
            <WatchModeToggle
              label="Watch tests"
              checked={workspace.runner && workspace.runner.isWatchMode}
              onChange={() => {
                workspace.runner && workspace.runner.toggleWatchModel();
              }}
              disabled={isRunning}
            />
          </div>
        </div>

        {workspace.runner &&
          workspace.runner.displayText !== "" && (
            <StatusBar>
              <ReactLoadingCustom
                type="cylon"
                color="#af7b06"
                height="7px"
                width="30px"
              />
              <StatusText>
                {workspace.runner && workspace.runner.displayText}
              </StatusText>
            </StatusBar>
          )}
      </BasicContent>
      <TestSummaryContainer>
        <TestSummary totalResult={workspace.files.totalResult} />
      </TestSummaryContainer>
      <CoverageSummary>
        <TestCoverage totalCoverage={workspace.files.totalCoverage} />
      </CoverageSummary>
    </Container>
  );
}

export default observer(Topbar);
