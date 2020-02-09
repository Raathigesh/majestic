import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { TestFileItem } from "./transformer";
import { TestFileResult } from "../../server/api/workspace/test-result/file-result";
import TestIndicator from "./test-indicator";
import { color, space } from "styled-system";
import * as Convert from "ansi-to-html";
import { CollapseStore } from "./collapseStore";

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

function childResultStatus (child: TestFileItem, testResult: TestFileResult): boolean {
  if (child.type === "it") {
    const childResult = getResults(child, testResult as any);
    return (childResult == null) || (childResult.status === "passed" || childResult.status === "pending");
  }
  if (child.children) {
    return child.children.every(child => childResultStatus(child, testResult));
  }
  return true;
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

const ViewToggle = styled.div`
  font-size: 15px;
  padding-right: 10px;
  padding-left: 10px;
  cursor: pointer;
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
  item: { id, name, only, children },
  item,
  result
}: Props) {
  const testResult = getResults(item, result as any);
  const isDurationAvailable = testResult && testResult.duration !== undefined;
  const haveFailure = testResult && testResult.failureMessages.length > 0;
  const allChildrenPassing = (children || []).every(child => {
    return childResultStatus(child, result as any);
  });
  
  const [hideChildren, setHideChildren] = useState(CollapseStore.isCollapsed(id) && allChildrenPassing);
  useEffect(() => {
    // we need to use the useEffect hook because the initial value passed to state only gets set when the component is 
    // created the first time. The useEffect hook will allow us to force the failed describe blocks open when the 
    // results change. 
    setHideChildren(CollapseStore.isCollapsed(id) && allChildrenPassing);
  }, [result]);

  const toggleShowChildern = () => {
    const newState = !hideChildren;
    setHideChildren(newState);
    CollapseStore.setState(id, newState);
  }
  return (
    <Container>
      <Content only={only} onClick={() => toggleShowChildern()}>
        <Label>
          { children && children.length > 0 && (
            <ViewToggle>
              {hideChildren ? "+" : "-"}
            </ViewToggle>
          )}
          <TestIndicator
            status={
              item.type === "describe" 
                ? ((allChildrenPassing) ? "passed" : "failed")
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
      {children && !hideChildren &&
        children.map(child => (
          <Test key={child.id} item={child} result={result} />
        ))}
    </Container>
  );
}
