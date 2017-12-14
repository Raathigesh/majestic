import * as React from "react";
import styled from "styled-components";
import { Workspace } from "../stores/Workspace";
import TestSummary from "./topbar/test-summary";
import TestCoverage from "./topbar/test-coverage";
import RunPanel from "./topbar/run-panel/panel";
import { observer } from "mobx-react";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #ececec;
  padding: 10px;
`;

const TestSummaryContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  margin-right: 10px;
  margin-left: 10px;
  margin-right: 20px;
  border-right: 1px solid #d3d8dd;
  padding-right: 20px;
  max-width: 350px;
`;

const CoverageSummary = styled.div`
  flex-grow: 1;
  max-width: 310px;
`;

export interface TopbarProps {
  workspace: Workspace;
  onPreferenceToggle: () => void;
}

function Topbar({ workspace, onPreferenceToggle }: TopbarProps) {
  return (
    <Container>
      <RunPanel workspace={workspace} />
      <TestSummaryContainer>
        <TestSummary totalResult={workspace.files.totalResult} />
      </TestSummaryContainer>
      <CoverageSummary>
        <TestCoverage totalCoverage={workspace.files.totalCoverage} />
      </CoverageSummary>
    </Container>
  );
}

export default observer(Topbar);
