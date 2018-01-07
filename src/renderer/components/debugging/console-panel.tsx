import * as React from "react";
import Draggable from "react-draggable";
import styled from "styled-components";
import { observer } from "mobx-react";
import { Workspace } from "../../stores/Workspace";
import ObjectInspector from "react-object-inspector";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 9999;
  height: 400px;
  width: 400px;
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 10px;
  overflow: auto;
`;

const Item = styled.div`
  padding: 5px;
  border-radius: 3px;
  color: #327fcc;
  background-color: #fffefe;
`;

const File = styled.span`
  font-size: 12px;
  color: #5c7080;
`;

const ConsoleContent = styled.div`
  align-content: space-between;
  flex-grow: 1;
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: flex-end;
`;

interface IConsolePanel {
  workspace: Workspace;
}

function ConsolePanel({ workspace }: IConsolePanel) {
  return (
    <Draggable>
      <Container className="pt-card">
        <ConsoleContent>
          {workspace.runner &&
            workspace.runner.consoleLogs.map(log => {
              return (
                <Item>
                  <File>{log.file}</File>

                  {typeof log.content === "string" ? (
                    <div>{log.content}</div>
                  ) : (
                    <ObjectInspector data={log.content} />
                  )}
                </Item>
              );
            })}
        </ConsoleContent>
        <BottomBar>
          <a
            className="pt-button pt-minimal pt-small pt-icon-eraser"
            onClick={() => {
              workspace.runner.consoleLogs.clear();
            }}
          >
            Clear
          </a>
        </BottomBar>
      </Container>
    </Draggable>
  );
}

export default observer(ConsolePanel);
