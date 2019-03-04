import React from "react";
import styled from "styled-components";
import { space, color } from "styled-system";
import { useMutation } from "react-apollo-hooks";
import FILEITEMS_SUB from "./file-items-subscription.gql";
import FILEITEMS from "./query.gql";
import RUNFILE from "./run-file.gql";
import FILERESULTSUB from "./subscription.gql";
import RESULT from "./result.gql";
import Test from "./test-item";
import { transform } from "./tranformer";
import useSubscription from "./use-subscription";
import FileSummary from "./summary";
import RUNNER_STATUS_QUERY from "./runner-status-query.gql";
import RUNNER_STATUS_SUBS from "./runner-status-subs.gql";

const Container = styled.div`
  ${space};
  ${color};
  flex-grow: 1;
  height: 100vh;
  padding-left: 20px;
`;

const TestItemsContainer = styled.div`
  overflow: auto;
  height: calc(100vh - 118px);
`;

interface Props {
  selectedFilePath: string;
}

export default function TestFile({ selectedFilePath }: Props) {
  const { data: fileItemResult } = useSubscription(
    FILEITEMS,
    FILEITEMS_SUB,
    {
      path: selectedFilePath
    },
    result => result.file,
    result => result.fileChange
  );

  const runFile = useMutation(RUNFILE, {
    variables: {
      path: selectedFilePath
    }
  });

  const { data: result } = useSubscription(
    RESULT,
    FILERESULTSUB,
    {
      path: selectedFilePath
    },
    result => result.result,
    result => result.changeToResult
  );

  const { data } = useSubscription(
    RUNNER_STATUS_QUERY,
    RUNNER_STATUS_SUBS,
    {},
    result => result.runnerStatus,
    result => result.runnerStatusChange
  );

  const roots = (fileItemResult.items || []).filter(
    item => item.parent === null
  );

  return (
    <Container p={4} bg="dark" color="text">
      <FileSummary
        isRunning={data.activeFile === selectedFilePath && data.running}
        path={selectedFilePath}
        onRun={() => {
          runFile();
        }}
        onWatch={() => {
          runFile({
            variables: {
              path: selectedFilePath,
              watch: true
            }
          });
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
