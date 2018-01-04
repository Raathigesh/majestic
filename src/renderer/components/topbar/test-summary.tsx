import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { TotalResult } from "../../stores/TotalResult";
import { Workspace } from "../../stores/Workspace";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
`;

const Row = styled.div`
  display: flex;
  margin-top: 7px;
  margin-bottom: 7px;
  & > span {
    min-width: 70px;
    font-size: 13px;
    margin-bottom: 3px;
    margin-right: 30px;
  }
`;

const ResultContainer = styled.div`
  display: flex;
`;

const ResultLabel = styled.div`
  display: flex;
  font-size: 16px;
  margin-right: 5px;
  min-width: 100px;

  & > div {
    font-size: 12px;
    color: gray;
    margin-left: 5px;
    align-self: center;
  }
`;
const Success = ResultLabel.extend`
  color: ${props => props.theme.project.summary.test.success};
`;
const Failed = ResultLabel.extend`
  color: ${props => props.theme.project.summary.test.failure};
`;
const ShowFailureButton = styled.button`
  border: 1px solid rgba(213, 211, 211, 0.57);
  margin-bottom: 10px;
`;

export interface TestSummaryProps {
  totalResult: TotalResult;
  workspace: Workspace;
}

function getLabel(value) {
  if (value === undefined) {
    return "-";
  }

  return value;
}

function TestSummary({ totalResult, workspace }: TestSummaryProps) {
  return (
    <Container>
      <div>Execution Summary</div>
      <Row>
        <span>Test Suites</span>
        <ResultContainer>
          <Success>
            {getLabel(totalResult.numPassedTestSuites)}
            <div>Success</div>
          </Success>
          <Failed>
            {getLabel(totalResult.numFailedTestSuites)}
            <div>Failed</div>
          </Failed>
        </ResultContainer>
      </Row>
      <Row>
        <span>Tests</span>
        <ResultContainer>
          <Success>
            {getLabel(totalResult.numPassedTests)}
            <div>Success</div>
          </Success>
          <Failed>
            {getLabel(totalResult.numFailedTests)}
            <div>Failed</div>
          </Failed>
        </ResultContainer>
      </Row>
      <Row>
        <span>Snapshots</span>
        <ResultContainer>
          <Success>
            {getLabel(totalResult.matchedSnaphots)}
            <div>Success</div>
          </Success>
          <Failed>
            {getLabel(totalResult.unmatchedSnapshots)}
            <div>Failed</div>
          </Failed>
        </ResultContainer>
      </Row>
      {(!!totalResult.numFailedTests || !!totalResult.unmatchedSnapshots) && (
        <ShowFailureButton
          type="button"
          className="pt-button pt-minimal pt-icon-list-detail-view pt-small pt-intent-danger"
          onClick={() => {
            workspace.showFailureSummary = true;
          }}
        >
          Show all failures
        </ShowFailureButton>
      )}
    </Container>
  );
}

export default observer(TestSummary);
