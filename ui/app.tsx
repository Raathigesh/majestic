import React from "react";
import styled from "styled-components";
import SplitPane from "react-split-pane";
import { useQuery } from "react-apollo-hooks";
import TestExplorer from "./tests-explorer";
import TestFile from "./test-file";
import APP from "./app.gql";
import useSubscription from "./test-file/use-subscription";
import SUMMARY_QUERY from "./summary-query.gql";
import SUMMARY_SUBS from "./summary-subscription.gql";
import RUNNER_STATUS_QUERY from "./runner-status-query.gql";
import RUNNER_STATUS_SUBS from "./runner-status-subs.gql";
import { Search } from "./search";

const ContainerDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

interface AppResult {
  app: { selectedFile: string };
}

export default function App() {
  const {
    data: {
      app: { selectedFile }
    },
    refetch
  } = useQuery<AppResult>(APP);

  const { data: summary = {} } = useSubscription(
    SUMMARY_QUERY,
    SUMMARY_SUBS,
    {},
    result => result.summary,
    result => result.changeToSummary,
    "Summary Sub"
  );

  const { data: runnerStatus } = useSubscription(
    RUNNER_STATUS_QUERY,
    RUNNER_STATUS_SUBS,
    {},
    result => result.runnerStatus,
    result => result.runnerStatusChange,
    "Runner subs"
  );
  console.log("runnerStatus", runnerStatus);
  return (
    <ContainerDiv>
      <SplitPane defaultSize={300} split="vertical">
        <TestExplorer
          selectedFile={selectedFile}
          onSelectedFileChange={refetch}
          summary={summary}
          runnerStatus={runnerStatus}
        />
        {selectedFile && (
          <TestFile
            selectedFilePath={selectedFile}
            runnerStatus={runnerStatus}
          />
        )}
      </SplitPane>
      <Search />
    </ContainerDiv>
  );
}
