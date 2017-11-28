import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { Workspace } from "../stores/Workspace";

const Container = styled.div`
  display: flex;
  background-color: #ececec;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 3px;
  justify-content: space-between;
  flex-direction: column;
`;

const ButtonBar = styled.div`
  display: flex;
  flex-direction: row;
`;

interface IActionPanelProps {
  workspace: Workspace;
  onRunTests: () => void;
  onPreferenceToggle: () => void;
}

function ActionPanel({
  workspace,
  onRunTests,
  onPreferenceToggle
}: IActionPanelProps) {
  const isRunning = workspace.runner && workspace.runner.isRunning;
  const label = isRunning ? "Re-run all tests" : "Run all tests";
  const iconClass = isRunning ? "pt-icon-refresh" : "pt-icon-play";
  return (
    <Container>
      <ButtonBar>
        <button
          type="button"
          className="pt-button pt-intent-success"
          onClick={() => {
            onRunTests();
          }}
        >
          <span className={`pt-icon-standard ${iconClass}`} />
          {label}
        </button>
        <button
          type="button"
          className="pt-button pt-icon-settings"
          onClick={() => {
            onPreferenceToggle();
          }}
        />
      </ButtonBar>
      {workspace.runner &&
        workspace.runner.isRunning && <div>Watching for changes</div>}
    </Container>
  );
}

export default observer(ActionPanel);
