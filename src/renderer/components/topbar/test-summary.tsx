import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { TotalResult } from "../../stores/TotalResult";

const Container = styled.div`
  display: flex;
  flex-direction: column;

  & > div {
    margin-bottom: 13px;
  }
`;

const Row = styled.div`
  display: flex;
  margin-top: 15px;
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

export interface TestSummaryProps {
  totalResult: TotalResult;
}

function getLabel(value) {
  if (value === undefined) {
    return "-";
  }

  return value;
}

function TestSummary({ totalResult }: TestSummaryProps) {
  return (
    <Container>
      <div>Execution Summary</div>
      <Row>
        <span>Test Suits</span>
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
    </Container>
  );
}

export default observer(TestSummary);
