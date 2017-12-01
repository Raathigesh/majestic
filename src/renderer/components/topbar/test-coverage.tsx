import * as React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  & > div {
    font-size: 13px;
    margin-bottom: 10px;
  }
`;

const Coverage = styled.div`
  flex-direction: column;
  margin-right: 10px;
  margin-bottom: 10px;
  font-size: 20px;
  display: flex;
  min-width: 115px;
  & > div {
    font-size: 12px;
    display: flex;
  }
`;

const CoverageRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export interface TestCoverageProps {}

export default function TestCoverage({  }: TestCoverageProps) {
  return (
    <Container>
      <div>Project Coverage</div>
      <div>
        <CoverageRow>
          <Coverage>
            10%
            <div>Statements coverage</div>
          </Coverage>
          <Coverage>
            50%
            <div>Branch coverage</div>
          </Coverage>
        </CoverageRow>
        <CoverageRow>
          <Coverage>
            40%
            <div>Functions coverage</div>
          </Coverage>
          <Coverage>
            80%
            <div>Lines coverage</div>
          </Coverage>
        </CoverageRow>
      </div>
    </Container>
  );
}
