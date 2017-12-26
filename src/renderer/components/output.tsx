import * as React from "react";
import * as ReactDOM from "react-dom";
import { Popover, Position } from "@blueprintjs/core";
import styled from "styled-components";
import { Workspace } from "../stores/Workspace";
import { observer } from "mobx-react";

const ConsoleContainer = styled.div`
  width: calc(100vw/2);
  height: calc(100vh/2);
  overflow: auto;
`;

const Pre = styled.pre`
  height: 100%;
  margin: 0;
  background-color: #474f57;
  color: white;
  overflow: auto;
  font-family: inherit;
  color: #e8d1a4;
`;

class ConsolePanel extends React.Component<{ output: string }, {}> {
  preRef: any;
  componentDidUpdate() {
    const node = ReactDOM.findDOMNode(this.preRef);
    node.scrollTop = node.scrollHeight;
  }

  render() {
    const { output } = this.props;
    return (
      <ConsoleContainer>
        <Pre ref={e => (this.preRef = e)}>
          {output || "The output from Jest process would show up here"}
        </Pre>
      </ConsoleContainer>
    );
  }
}

interface IOutputProps {
  workspace: Workspace;
  children: any;
}

function Output({ workspace, children }: IOutputProps) {
  return (
    <Popover
      position={Position.BOTTOM}
      isOpen={workspace.showOutputPanel}
      onClose={() => {
        workspace.showOutputPanel = false;
      }}
      canEscapeKeyClose
      content={
        <ConsolePanel output={workspace.runner && workspace.runner.output} />
      }
    >
      {children}
    </Popover>
  );
}

export default observer(Output);
