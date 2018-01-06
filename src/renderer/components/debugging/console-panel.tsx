import * as React from "react";
import Draggable from "react-draggable";
import styled from "styled-components";
import { observer } from "mobx-react";
import { Workspace } from "../../stores/Workspace";

const Container = styled.div`
  z-index: 9999;
  height: 400px;
  width: 400px;
`;

interface IConsolePanel {
  workspace: Workspace;
}

function ConsolePanel({ workspace }: IConsolePanel) {
  return (
    <Draggable>
      <Container className="pt-card">
        {workspace.runner &&
          workspace.runner.consoleLogs.map(log => {
            return <pre>{log}</pre>;
          })}
      </Container>
    </Draggable>
  );
}

export default observer(ConsolePanel);
