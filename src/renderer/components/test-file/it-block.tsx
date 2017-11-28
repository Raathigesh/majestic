import * as React from "react";
import { TestReconcilationState } from "jest-editor-support";
import { observer } from "mobx-react";
import styled from "styled-components";
import Highlight from "react-highlight";
import Indicator from "./indicator";
import { Workspace } from "../../stores/Workspace";
import TreeNode from "../../stores/TreeNode";
import ItBlockWithStatus from "../../types/it-block";
import { getStatusLabel } from "../../util/label";

import "highlight.js/styles/idea.css";
import "react-ansi-style/inject-css";

const Container = styled.div`
  padding: 8px;
  margin: 15px;
  display: flex;
  flex-direction: column;
`;

interface StatusIndicatorProps {
  status: TestReconcilationState;
  theme?: any;
}

const RightContent = styled.div`
  margin-left: auto;
  display: flex;
`;

const StatusIndicator = styled.div`
  color: white;
  font-size: 12px;

  color: ${(props: StatusIndicatorProps) =>
    props.theme.TestStatus[props.status]};

  border-radius: 50px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  text-align: center;
  margin-right: 10px;
  min-width: 100px;
  display: flex;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
`;
const Title = styled.span`
  font-size: 15px;
`;
const Run = styled.button`
  border-radius: 50px;
  margin-right: 10px;
  border: 2px solid #106ba3;
  width: 34px;
`;
const AcceptSnapshot = styled.button`
  margin-right: 10px;
`;
const SnapshotUpdatedStatus = styled.span`
  margin-right: 10px;
  margin-top: 4px;
  color: blue;
  font-size: 13px;
`;

export interface ItBlockProps {
  test?: TreeNode;
  it: ItBlockWithStatus;
  workspace: Workspace;
}

function It({ it, workspace, test }: ItBlockProps) {
  return (
    <Container>
      <Header>
        <Run
          type="button"
          className="pt-button pt-icon-play pt-minimal"
          onClick={() => {
            workspace.runTest(it);
          }}
        />

        <Title>{it.name}</Title>
        <RightContent>
          {it.snapshotErrorStatus === "error" && (
            <AcceptSnapshot
              type="button"
              className="pt-button pt-icon-tick"
              onClick={() => {
                workspace.updateSnapshot(it);
              }}
            >
              Update snapshot
            </AcceptSnapshot>
          )}
          {it.snapshotErrorStatus === "updated" && (
            <SnapshotUpdatedStatus>Snapshot updated</SnapshotUpdatedStatus>
          )}
          {(it.status !== "Unknown" || it.isExecuting) && (
            <StatusIndicator status={it.status}>
              <Indicator isExecuting={it.isExecuting} status={it.status} />
              {getStatusLabel(it.status)}
            </StatusIndicator>
          )}
        </RightContent>
      </Header>
      {it.assertionMessage !== "" && <pre>{it.assertionMessage}</pre>}
    </Container>
  );
}

export default observer(It);
