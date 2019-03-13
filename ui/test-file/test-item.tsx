import React, { Fragment } from "react";
import styled from "styled-components";
import { TestFileItem } from "./tranformer";
import { TestFileResult } from "../../server/api/workspace/test-result/file-result";
import TestIndicator from "./test-indicator";
import { color, space } from "styled-system";

function getResults(item: TestFileItem, testResult: TestFileResult) {
  if (!testResult || !testResult.testResults) {
    return null;
  }

  return testResult.testResults.find(result => result.title === item.name);
}

const Container = styled.div`
  ${color};
  ${space};
  padding-left: 25px;
  padding-bottom: 5px;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 13px;

  span {
    margin-left: 5px;
  }
`;

const Content = styled.div`
  padding: 5px;
  min-height: 25px;
  display: flex;
  flex-direction: column;
`;

const FailtureMessage = styled.div`
  padding-left: 20px;
  pre {
    overflow: auto;
  }
`;

const Duration = styled.span`
  font-weight: 400;
  font-size: 12px;
  color: #fcd101;
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
  const testResult = getResults(item, result as any);
  const isDurationAvailable = testResult && testResult.duration !== undefined;
  return (
    <Container>
      <Content>
        <Label>
          <TestIndicator status={testResult && testResult.status} />
          <span>{name}</span>
          {isDurationAvailable && (
            <Duration>{testResult && testResult.duration} ms</Duration>
          )}
        </Label>
        {testResult && testResult.failureMessages.length > 0 && (
          <FailtureMessage>
            <pre>{testResult.failureMessages.join(",")}</pre>
          </FailtureMessage>
        )}
      </Content>
      {children &&
        children.map(child => (
          <Test key={child.id} item={child} result={result} />
        ))}
    </Container>
  );
}
