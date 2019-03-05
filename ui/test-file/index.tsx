import React from "react";
import styled from "styled-components";
import { space, color } from "styled-system";
import { useMutation } from "react-apollo-hooks";
import FILEITEMS_SUB from "./file-items-subscription.gql";
import FILEITEMS from "./query.gql";
import RUNFILE from "./run-file.gql";
import UPDATE_SNAPSHOT from "./update-snapshot.gql";
import FILERESULTSUB from "./subscription.gql";
import RESULT from "./result.gql";
import Test from "./test-item";
import { transform } from "./tranformer";
import useSubscription from "./use-subscription";
import FileSummary from "./summary";
import { RunnerStatus } from "../../server/api/runner/status";
import { TestFileResult } from "../../server/api/workspace/test-result/file-result";
import { TestFile as TestFileModel } from "../../server/api/workspace/test-file";

const Container = styled.div`
  ${space};
  ${color};
  flex-grow: 1;
  height: 100vh;
  padding-left: 20px;
`;

const TestItemsContainer = styled.div`
  margin-left: -25px;
  overflow: auto;
  height: calc(100vh - 118px);
`;

interface Props {
  selectedFilePath: string;
  runnerStatus: RunnerStatus;
}

export default function TestFile({ selectedFilePath, runnerStatus }: Props) {
  const { data: fileItemResult }: { data: TestFileModel } = useSubscription(
    FILEITEMS,
    FILEITEMS_SUB,
    {
      path: selectedFilePath
    },
    result => result.file,
    result => result.fileChange
  );

  const suiteCount = ((fileItemResult && fileItemResult.items) || []).filter(
    fileItem => fileItem.type === "describe"
  ).length;

  const testCount = ((fileItemResult && fileItemResult.items) || []).filter(
    fileItem => fileItem.type === "it" || fileItem.type === "test"
  ).length;

  const runFile = useMutation(RUNFILE, {
    variables: {
      path: selectedFilePath
    }
  });

  const updateSnapshot = useMutation(UPDATE_SNAPSHOT, {
    variables: {
      path: selectedFilePath
    }
  });

  const { data: result }: { data: TestFileResult } = useSubscription(
    RESULT,
    FILERESULTSUB,
    {
      path: selectedFilePath
    },
    result => result.result,
    result => result.changeToResult
  );

  const haveSnapshotFailures = ((result && result.testResults) || []).some(
    testResult => {
      return (testResult.failureMessages || []).some(failureMessage =>
        failureMessage.includes("snapshot")
      );
    }
  );

  const roots = (fileItemResult.items || []).filter(
    item => item.parent === null
  );

  return (
    <Container p={4} bg="dark" color="text">
      <FileSummary
        suiteCount={suiteCount}
        testCount={testCount}
        passingTests={result.numPassingTests}
        failingTests={result.numFailingTests}
        path={selectedFilePath}
        runnerStatus={runnerStatus}
        haveSnapshotFailures={haveSnapshotFailures}
        onRun={() => {
          runFile();
        }}
        onSnapshotUpdate={() => {
          updateSnapshot();
        }}
      />

      {fileItemResult && (
        <TestItemsContainer>
          {roots.map(item => {
            const tree = transform(item, fileItemResult.items as any);
            return <Test key={item.id} item={tree} result={result} />;
          })}
        </TestItemsContainer>
      )}
    </Container>
  );
}
