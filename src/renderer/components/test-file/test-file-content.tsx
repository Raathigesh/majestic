import * as React from "react";
import It from "./it-block";
import { observer } from "mobx-react";
import styled from "styled-components";
import { Workspace } from "../../stores/Workspace";
import { observable } from "mobx";
import Header from "./header";

export interface TestFileContentProps {
  workspace: Workspace;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Tests = styled.div`
  overflow: auto;
  height: calc(100vh - 271px);
`;

function TestFileContent({ workspace }: TestFileContentProps) {
  return (
    <Container>
      <Header workspace={workspace} />
      <Tests>
        {(
          (workspace.selectedTest && workspace.selectedTest.itBlocks) ||
          observable([])
        ).map((it, i) => {
          return (
            <It
              key={`${it.name}:${i}`}
              it={it}
              workspace={workspace}
              test={workspace.selectedTest}
            />
          );
        })}
      </Tests>
    </Container>
  );
}

export default observer(TestFileContent);
