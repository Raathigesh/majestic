import * as React from "react";
import styled from "styled-components";
import CoverageSummary from "../../stores/CoverageSummary";
import { observer } from "mobx-react";

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

export interface TestCoverageProps {
  totalCoverage: CoverageSummary;
}

const getLabel = value => (value === undefined ? "-" : `${value}%`);

function TestCoverage({ totalCoverage }: TestCoverageProps) {
  return (
    <Container>
      <div>Project Coverage</div>
      <div>
        <CoverageRow>
          <Coverage>
            {getLabel(totalCoverage.statementPercentage)}
            <div>Statements coverage</div>
          </Coverage>
          <Coverage>
            {getLabel(totalCoverage.branchesPercentage)}
            <div>Branch coverage</div>
          </Coverage>
        </CoverageRow>
        <CoverageRow>
          <Coverage>
            {getLabel(totalCoverage.functionPercentage)}
            <div>Functions coverage</div>
          </Coverage>
          <Coverage>
            {getLabel(totalCoverage.linePercentage)}
            <div>Lines coverage</div>
          </Coverage>
        </CoverageRow>
      </div>
    </Container>
  );
}

export default observer(TestCoverage);
