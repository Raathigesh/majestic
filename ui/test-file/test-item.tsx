import React, { Fragment } from "react";
import styled from "styled-components";
import { TestFileItem } from "./transformer";
import { TestFileResult } from "../../server/api/workspace/test-result/file-result";
import TestIndicator from "./test-indicator";
import { color, space } from "styled-system";
import * as Convert from "ansi-to-html";
import OPEN_FAILURE from "./open-failure.gql";
import { useMutation } from "react-apollo-hooks";

const convert = new Convert({
  colors: {
    1: "#FF4F56",
    2: "#19E28D"
  }
});

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

const Content = styled.div<any>`
  padding: 5px;
  display: flex;
  flex-direction: column;

  background-color: #262529;
  border-radius: 4px;
  margin-bottom: 10px;
  border: 1px solid ${props => (props.only ? "#9d8301" : "#333437")};
`;

const FailureMessage = styled.div`
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

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface Props {
  item: TestFileItem;
  result: TestFileResult | null;
}

export default function Test({
  item: { name, only, children },
  item,
  result
}: Props) {
  const testResult = getResults(item, result as any);
  const isDurationAvailable = testResult && testResult.duration !== undefined;
  const haveFailure = testResult && testResult.failureMessages.length > 0;
  const allChildrenPassing = (children || []).every(child => {
    if (child.type === "it") {
      const childResult = getResults(child, result as any);
      return childResult && childResult.status === "passed";
    }

    return true;
  });

          if (children && children.length > 0) {
    }

  const openFailure = useMutation(OPEN_FAILURE, {
    variables: {
      failure: testResult && testResult.failureMessages ? testResult.failureMessages[0] : ''
    }
  });

  return (
    <Container>
      <Content only={only} onClick={ () => openFailure()}>
        <Label>
          <TestIndicator
            status={
              item.type === "describe" && allChildrenPassing
                ? "passed"
                : testResult && testResult.status
            }
            describe={item.type === "describe"}
            todo={item.type === "todo"}
          />
          <span>{name}</span>
          {isDurationAvailable && (
            <Duration>{testResult && testResult.duration} ms</Duration>
          )}
        </Label>
        {testResult && haveFailure && (
          <FailureMessage>
            <pre
              dangerouslySetInnerHTML={{
                __html: convert.toHtml(
                  escapeHtml(testResult.failureMessages.join(","))
                )
              }}
            />
          </FailureMessage>
        )}
      </Content>
      {children &&
        children.map(child => (
          <Test key={child.id} item={child} result={result} />
        ))}
    </Container>
  );
}
