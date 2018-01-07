import * as React from "react";
import styled from "styled-components";
import { Switch, Intent } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/labs";
import cn from "classnames";
import { observer } from "mobx-react";
import Info from "./info";
import { Workspace } from "../../../stores/Workspace";

const BasicContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-right: 20px;
  border-right: 1px solid #d3d8dd;
  padding-right: 20px;
  max-width: 450px;
`;

const WatchModeToggle = styled(Switch)`
  margin-top: 7px;
  margin-bottom: 0px;
  margin-left: 10px;
  margin-right: 10px;
`;

const ButtonGroup = styled.div``;
const RightButtons = styled.div`
  display: flex;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid #d2d2d2;
  margin-top: 5px;
  border-radius: 3px;
`;

function runButtonLabel(isRunning, isWatching) {
  if (isWatching) {
    return isRunning ? "Running" : "Rerun all tests";
  } else {
    return isRunning ? "Running" : "Run all tests";
  }
}

export interface RunPanelProps {
  workspace: Workspace;
}

function RunPanel({ workspace }: RunPanelProps) {
  const isRunning = workspace.runner && workspace.runner.isRunning;
  const isWatching = workspace.runner && workspace.runner.isWatching;
  return (
    <BasicContent>
      <Info workspace={workspace} />
      <ButtonsContainer>
        <ButtonGroup className="pt-button-group pt-minimal">
          <Tooltip2
            content={runButtonLabel(isRunning, isWatching)}
            inline={true}
            intent={Intent.PRIMARY}
            placement="bottom"
          >
            <a
              className={cn("pt-button  pt-minimal pt-icon-play", {
                "pt-disabled": isRunning
              })}
              onClick={() => {
                workspace.runProject();
              }}
            />
          </Tooltip2>
          <Tooltip2
            content="Stop tests"
            inline={true}
            intent={Intent.PRIMARY}
            placement="bottom"
          >
            <a
              className={cn("pt-button pt-icon-stop", {
                "pt-disabled": !isRunning && !isWatching
              })}
              onClick={() => {
                workspace.stop();
              }}
            />
          </Tooltip2>
          <Tooltip2
            content="Close project"
            inline={true}
            intent={Intent.PRIMARY}
            placement="bottom"
          >
            <a
              className={cn("pt-button pt-icon-cross")}
              onClick={() => {
                workspace.closeProject();
              }}
            />
          </Tooltip2>
        </ButtonGroup>
        <RightButtons>
          <WatchModeToggle
            label="Watch tests"
            checked={workspace.runner && workspace.runner.isWatchMode}
            onChange={() => {
              if (workspace.runner) {
                workspace.runner.toggleWatchModel();
              }
            }}
            disabled={isRunning}
          />
          <Tooltip2
            content="Preference"
            inline={true}
            intent={Intent.PRIMARY}
            placement="bottom"
          >
            <a
              className={cn("pt-button pt-icon-cog pt-minimal")}
              onClick={() => {
                workspace.preference.setPreferenceOpen(true);
              }}
            />
          </Tooltip2>
        </RightButtons>
      </ButtonsContainer>
    </BasicContent>
  );
}

export default observer(RunPanel);
