import React, { Fragment } from "react";
import styled from "styled-components";
import {} from "styled-system";
import { TestFileItem } from "./tranformer";
import { TestFileResult } from "../../server/api/workspace/test-result/file-result";

function getResults(item: TestFileItem, testResult: TestFileResult) {
  if (!testResult || !testResult.testResults) {
    return null;
  }
  return testResult.testResults.find(result => result.title === item.name);
}

const Container = styled.div`
  margin-left: 15px;
  padding: 4px;
`;

interface Props {
  item: TestFileItem;
  result: TestFileResult | null;
}

export default function Test({
  item: { name, children },
  item,
  result
}: Props) {
  const testResult = getResults(item, result);
  return (
    <Container>
      {name}
      {testResult && testResult.status}
      {children && children.map(child => <Test item={child} result={result} />)}
    </Container>
  );
}
