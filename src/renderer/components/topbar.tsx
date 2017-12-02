import * as React from "react";
import styled from "styled-components";
import ReactLoading from "react-loading";
import { Workspace } from "../stores/Workspace";
import TestSummary from "./topbar/test-summary";
import TestCoverage from "./topbar/test-coverage";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #fbf9ff;
  padding: 10px;
  justify-content: space-between;
`;

const StatusBar = styled.div`
  font-weight: 450;
  font-size: 12px;
  display: flex;
  flex-direction: row;
  align-self: center;
  margin-left: 10px;
  background-color: #fff8e9;
  padding: 5px;
  border-radius: 3px;
  border: 1px solid #ffe9bf;
  width: 100%;
  margin-left: 10px;
  margin-right: 10px;
`;
const StatusText = styled.div`
  margin-top: 2px;
  margin-left: 10px;
  color: #926106;
`;

const BasicContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;
const ReactLoadingCustom = styled(ReactLoading)`
  margin-top: -5px;
`;

const TestSummaryContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  margin-right: 10px;
  margin-left: 10px;
`;

const CoverageSummary = styled.div`
  flex-grow: 1;
`;

export interface TopbarProps {
  workspace: Workspace;
  onRunTests: () => void;
  onPreferenceToggle: () => void;
}

export default function Topbar({
  workspace,
  onRunTests,
  onPreferenceToggle
}: TopbarProps) {
  return (
    <Container>
      <BasicContent>
        <div>
          <div className="pt-button-group pt-minimal pt-fill">
            <a
              className="pt-button pt-icon-play"
              onClick={() => {
                onRunTests();
              }}
            >
              Run all tests
            </a>
            <a className="pt-button pt-icon-automatic-updates">
              Run all and watch
            </a>
            <a
              className="pt-button pt-icon-settings"
              onClick={() => {
                onPreferenceToggle();
              }}
            />
          </div>
        </div>

        <StatusBar>
          <ReactLoadingCustom
            type="cylon"
            color="#af7b06"
            height="7px"
            width="30px"
          />
          <StatusText>Booting up Jest</StatusText>
        </StatusBar>
      </BasicContent>
      <TestSummaryContainer>
        <TestSummary totalResult={workspace.files.totalResult} />
      </TestSummaryContainer>
      <CoverageSummary>
        <TestCoverage totalCoverage={workspace.files.totalCoverage} />
      </CoverageSummary>
    </Container>
  );
}
