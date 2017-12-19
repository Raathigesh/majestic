import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";

import { Workspace } from "../stores/Workspace";
import Preference from "../stores/Preference";
import TestFileContent from "./test-file/test-file-content";
import EmptyContent from "./empty-content";
import CodeViewer from "./code-viewer";
import Topbar from "./topbar";
import FailSummary from "./fail-summary/fail-summary";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

interface ContentProps {
  workspace: Workspace;
  preference: Preference;
}

function Content({ workspace, preference }: ContentProps) {
  let markers: any[] = [];

  if (workspace.coverageForFile) {
    markers = Object.keys(workspace.coverageForFile.statementMap).map(key => {
      const value = workspace.coverageForFile.statementMap[key];
      return {
        startRow: value.start.line - 1,
        startCol: value.start.column,
        endRow: value.end.line - 1,
        endCol: value.end.column,
        className: "warning",
        type: "line"
      };
    });
  }

  return (
    <Container>
      {workspace.isProjectAvailable && (
        <Topbar
          workspace={workspace}
          onPreferenceToggle={() => {
            preference.setPreferenceOpen(true);
          }}
        />
      )}
      {!workspace.isProjectAvailable && (
        <EmptyContent preference={preference} workspace={workspace} />
      )}
      {workspace.showFailureSummary && <FailSummary workspace={workspace} />}
      {workspace.selectedTest &&
        workspace.selectedTest.isTest &&
        !workspace.showFailureSummary && (
          <TestFileContent workspace={workspace} />
        )}
      {workspace.selectedTest &&
        !workspace.selectedTest.isTest &&
        !workspace.showFailureSummary &&
        (workspace.selectedTest && (
          <CodeViewer
            node={workspace.selectedTest}
            code={workspace.selectedTest.content}
            markers={markers}
          />
        ))}
    </Container>
  );
}

export default observer(Content);
