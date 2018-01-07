import * as React from "react";
import styled from "styled-components";
import TreeNode from "../../stores/TreeNode";

const Container = styled.div`
  display: flex;
  background-color: #fbf9ff;
  padding-bottom: 10px;
`;

const Coverage = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  flex-basis: 25%;
  font-size: 20px;
  text-align: center;
  & > div {
    font-size: 12px;
  }
`;

export interface FileCoverageProps {
  node: TreeNode;
}

export default function FileCoverage({
  node: { coverage }
}: FileCoverageProps) {
  return (
    <Container>
      <Coverage>
        {coverage.statementPercentage}%
        <div>Statements coverage</div>
      </Coverage>
      <Coverage>
        {coverage.branchesPercentage}%
        <div>Branch coverage</div>
      </Coverage>
      <Coverage>
        {coverage.functionPercentage}%
        <div>Functions coverage</div>
      </Coverage>
      <Coverage>
        {coverage.linePercentage}%
        <div>Lines coverage</div>
      </Coverage>
    </Container>
  );
}
