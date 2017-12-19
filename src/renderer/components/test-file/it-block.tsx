import * as React from "react";
import { TestReconcilationState } from "jest-editor-support";
import { observer } from "mobx-react";
import styled from "styled-components";
import Indicator from "./indicator";
import { Workspace } from "../../stores/Workspace";
import TreeNode from "../../stores/TreeNode";
import ItBlockWithStatus from "../../types/it-block";
import { getStatusLabel } from "../../util/label";
require("react-ansi-style/inject-css");

import "highlight.js/styles/idea.css";
import "react-ansi-style/inject-css";
import { Button } from "@blueprintjs/core";

const Container = styled.div`
  padding: 8px;
  margin: 15px;
  display: flex;
  flex-direction: column;
  border: 1px solid #d8d8d8;
  border-radius: 3px;
  background-color: ${props => (props.active ? "wheat" : "")};
`;

interface StatusIndicatorProps {
  f;
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
  margin-right: 10px;
  width: 34px;
`;
const AcceptSnapshot = styled(Button)`
  margin-right: 10px;
`;
const SnapshotUpdatedStatus = styled.span`
  margin-right: 10px;
  margin-top: 4px;
  color: blue;
  font-size: 13px;
`;

const Error = styled.pre`
  color: #c44d58;
  box-shadow: none;
`;

const ExecutingLabel = styled.label`
  color: rgba(196, 79, 89, 0.98);
`;

export interface ItBlockProps {
  test?: TreeNode;
  it: ItBlockWithStatus;
  workspace: Workspace;
}

function It({ it, workspace, test }: ItBlockProps) {
  return (
    <Container active={it.active}>
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
              className="pt-button pt-icon-tick pt-minimal pt-intent-primary"
              onClick={() => {
                workspace.updateSnapshot(it);
              }}
              loading={it.updatingSnapshot}
            >
              Update snapshot
            </AcceptSnapshot>
          )}
          {it.snapshotErrorStatus === "updated" && (
            <SnapshotUpdatedStatus>Snapshot updated</SnapshotUpdatedStatus>
          )}
          <StatusIndicator status={it.status}>
            {!it.isExecuting && (
              <Indicator isExecuting={it.isExecuting} status={it.status} />
            )}
            {it.isExecuting ? (
              <ExecutingLabel>Executing</ExecutingLabel>
            ) : (
              getStatusLabel(it.status)
            )}
          </StatusIndicator>
        </RightContent>
      </Header>
      <div>
        {it.assertionMessage !== "" && (
          <Error
            style={{ marginTop: 5, whiteSpace: "pre-wrap" }}
            dangerouslySetInnerHTML={{
              __html: (it.assertionMessage || "")
                .replace(/\u001b/g, "")
                .replace(/\[22?m?/g, "")
                .replace(/\[31m/g, `<strong style="color: red">`)
                .replace(/\[32m/g, `<strong style="color: green">`)
                .replace(/\[39m/g, `</strong>`)
            }}
          />
        )}
      </div>
    </Container>
  );
}

export default observer(It);
