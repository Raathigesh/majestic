import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import Header from "./header";
import { Workspace } from "../../stores/Workspace";
import It from "../../stores/ItBlock";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: calc(100vh - 200px);
`;

export interface FailSummaryProps {
  workspace: Workspace;
}

function FailSummary({ workspace }: FailSummaryProps) {
  const failedTests = workspace.files.getFailedItStatements();
  return (
    <Container>
      {[...failedTests.entries()].map(([path, its]) => {
        return (
          <div key={path}>
            <Header filePath={path} workspace={workspace} />
            {its.map((it, i) => {
              return (
                <It
                  key={`${path}${it.name}${i}`}
                  workspace={workspace}
                  it={it}
                />
              );
            })}
          </div>
        );
      })}
    </Container>
  );
}

export default observer(FailSummary);
