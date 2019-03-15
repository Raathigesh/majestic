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

const Container = styled.div<any>`
  ${space};
  ${color};
  height: 100vh;
  padding-left: 20px;
`;

const TestItemsContainer = styled.div`
  overflow: auto;
  height: calc(100vh - 118px);
`;

interface Props {
  selectedFilePath: string;
  isRunning: boolean;
  projectRoot: string;
  onStop: () => void;
}

export default function TestFile({
  selectedFilePath,
  isRunning,
  projectRoot,
  onStop
}: Props) {
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
    <Container p={5} bg="dark" color="text">
      <FileSummary
        projectRoot={projectRoot}
        suiteCount={suiteCount}
        testCount={testCount}
        passingTests={result && result.numPassingTests}
        failingTests={result && result.numFailingTests}
        path={selectedFilePath}
        isRunning={isRunning}
        haveSnapshotFailures={haveSnapshotFailures}
        onRun={() => {
          runFile();
        }}
        onStop={onStop}
        onSnapshotUpdate={() => {
          updateSnapshot();
        }}
      />

      {fileItemResult && (
        <TestItemsContainer>
          {roots.map(item => {
            const tree = transform(
              item as any,
              fileItemResult.items as any,
              0
            ) as any;
            return <Test key={item.id} item={tree} result={result} />;
          })}
        </TestItemsContainer>
      )}
    </Container>
  );
}
