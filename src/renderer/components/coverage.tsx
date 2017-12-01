import * as React from "react";
import styled from "styled-components";
import TreeNode from "../stores/TreeNode";

const Container = styled.div`
  display: flex;
`;

const Coverage = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 0;
  flex-basis: 25%;
  font-size: 20px;
  text-align: center;
  align-self: center;
  display: flex;
  & > div {
    font-size: 12px;
    align-self: center;
    display: flex;
  }
`;

export interface FileCoverageProps {}

export default function FileCoverage({  }: FileCoverageProps) {
  return (
    <Container>
      <Coverage>
        10%
        <div>Statements coverage</div>
      </Coverage>
      <Coverage>
        50%
        <div>Branch coverage</div>
      </Coverage>
      <Coverage>
        40%
        <div>Functions coverage</div>
      </Coverage>
      <Coverage>
        80%
        <div>Lines coverage</div>
      </Coverage>
    </Container>
  );
}
