import * as React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;

  & > div {
    margin-bottom: 13px;
  }
`;

const Row = styled.div`
  display: flex;

  & > span {
    min-width: 70px;
    font-size: 13px;
    margin-bottom: 3px;
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

export interface TestSummaryProps {}

export default function TestSummary(props: TestSummaryProps) {
  return (
    <Container>
      <div>Execution Summary</div>
      <Row>
        <span>Test Suits</span>
        <ResultContainer>
          <Success>
            145
            <div>Success</div>
          </Success>
          <Failed>
            85
            <div>Failed</div>
          </Failed>
        </ResultContainer>
      </Row>
      <Row>
        <span>Tests</span>
        <ResultContainer>
          <Success>
            45
            <div>Success</div>
          </Success>
          <Failed>
            85
            <div>Failed</div>
          </Failed>
        </ResultContainer>
      </Row>
      <Row>
        <span>Snapshots</span>
        <ResultContainer>
          <Success>
            45
            <div>Success</div>
          </Success>
          <Failed>
            85
            <div>Failed</div>
          </Failed>
        </ResultContainer>
      </Row>
    </Container>
  );
}
