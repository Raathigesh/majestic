import React, { Fragment } from "react";
import styled from "styled-components";
import {} from "styled-system";
import { TestFileItem } from "./tranformer";
import { TestFileResult } from "../../server/api/workspace/test-result/file-result";
import TestIndicator from "./test-indicator";

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

const Content = styled.div`
  padding: 5px;
  display: flex;
  align-items: center;
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
      <Content>
        <TestIndicator status={testResult && testResult.status} />
        {name}
        {testResult && testResult.status}
      </Content>
      {children &&
        children.map(child => (
          <Test key={child.id} item={child} result={result} />
        ))}
    </Container>
  );
}
