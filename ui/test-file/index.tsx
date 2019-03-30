import React, { memo } from "react";
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
import { transform } from "./transformer";
import useSubscription from "./use-subscription";
import FileSummary from "./summary";
import { TestFileResult } from "../../server/api/workspace/test-result/file-result";
import { TestFile as TestFileModel } from "../../server/api/workspace/test-file";
import ConsolePanel from "./console-panel";
import ErrorPanel from "./error-panel";

const Container = styled.div<any>`
  ${space};
  ${color};
  height: 100vh;
  padding-left: 20px;
`;

const Content = styled.div`
  overflow: auto;
  height: calc(100vh - 118px);
`;

const TestItemsContainer = styled.div`
  margin-left: -25px;
`;

interface Props {
  selectedFilePath: string;
  isRunning: boolean;
  projectRoot: string;
  onStop: () => void;
}

function TestFile({ selectedFilePath, isRunning, projectRoot, onStop }: Props) {
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
    fileItem => fileItem.type === "it"
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

  const {
    data: result,
    loading
  }: { data: TestFileResult; loading: boolean } = useSubscription(
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
        isLoadingResult={loading}
        haveSnapshotFailures={haveSnapshotFailures}
        onRun={() => {
          runFile();
        }}
        onStop={onStop}
        onSnapshotUpdate={() => {
          updateSnapshot();
        }}
      />
      <Content>
        {result && result.testResults && result.testResults.length === 0 && (
          <ErrorPanel failureMessage={result && result.failureMessage} />
        )}
        {result && result.consoleLogs && result.consoleLogs.length > 0 && (
          <ConsolePanel consoleLogs={result.consoleLogs || []} />
        )}
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
      </Content>
    </Container>
  );
}

export default memo(TestFile, (pre: Props, next: Props) => {
  return (
    pre.isRunning === next.isRunning &&
    pre.selectedFilePath === next.selectedFilePath
  );
});
