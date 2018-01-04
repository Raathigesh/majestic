import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";
import { Workspace } from "../stores/Workspace";
import { observer } from "mobx-react";

const ConsoleContainer = styled.div`
  height: 100vh;
  width: 600px;
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

const SlidingPanel = styled.div`
  height: 100vh;
  width: 600px;
  background-color: black;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 99999;
`;

const Overlay = styled.div`
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 9999;
  right: 0;
  background-color: transparent;
  left: 0;
`;

function Output({ workspace, children }: IOutputProps) {
  return (
    <div>
      {workspace.showOutputPanel && (
        <Overlay
          onClick={() => {
            workspace.showOutputPanel = false;
          }}
        >
          <SlidingPanel>
            <ConsolePanel
              output={workspace.runner && workspace.runner.output}
            />
          </SlidingPanel>
        </Overlay>
      )}
      {children}
    </div>
  );
}

export default observer(Output);
