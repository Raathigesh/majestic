import React, { useState } from "react";
import styled from "styled-components";
import SplitPane from "react-split-pane";
import { useQuery, useMutation } from "react-apollo-hooks";
import Sidebar from "./sidebar";
import TestFile from "./test-file";
import APP from "./app.gql";
import WORKSPACE from "./query.gql";
import useSubscription from "./test-file/use-subscription";
import SUMMARY_QUERY from "./summary-query.gql";
import SUMMARY_SUBS from "./summary-subscription.gql";
import RUNNER_STATUS_QUERY from "./runner-status-query.gql";
import RUNNER_STATUS_SUBS from "./runner-status-subs.gql";
import STOP_RUNNER from "./stop-runner.gql";
import { Search } from "./search";
import SET_SELECTED_FILE from "./set-selected-file.gql";
import { Workspace } from "../server/api/workspace/workspace";

const ContainerDiv = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

interface AppResult {
  app: { selectedFile: string };
}

interface WorkspaceResult {
  workspace: Workspace;
}

export default function App() {
  const {
    data: {
      app: { selectedFile }
    },
    refetch
  } = useQuery<AppResult>(APP);

  const {
    data: { workspace },
    refetch: refetchFiles
  } = useQuery<WorkspaceResult>(WORKSPACE);

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

  const setSelectedFile = useMutation(SET_SELECTED_FILE);
  const handleFileSelection = (path: string) => {
    setSelectedFile({
      variables: {
        path
      }
    });
    refetch();
  };

  const stopRunner = useMutation(STOP_RUNNER);

  const [isSearchOpen, setSearchOpen] = useState(false);

  return (
    <ContainerDiv>
      <SplitPane
        defaultSize={"calc(100% - 300px)"}
        split="vertical"
        primary="second"
        pane1Style={{ minWidth: "300px" }}
      >
        <Sidebar
          workspace={workspace}
          selectedFile={selectedFile}
          onSelectedFileChange={handleFileSelection}
          summary={summary}
          runnerStatus={runnerStatus}
          onSearchOpen={() => {
            setSearchOpen(true);
          }}
          onRefreshFiles={() => {
            refetchFiles();
          }}
          onStop={() => {
            stopRunner();
          }}
        />
        {selectedFile && (
          <TestFile
            projectRoot={workspace.projectRoot}
            selectedFilePath={selectedFile}
            runnerStatus={runnerStatus}
            onStop={() => {
              stopRunner();
            }}
          />
        )}
      </SplitPane>
      <Search
        projectRoot={workspace.projectRoot}
        show={isSearchOpen}
        files={workspace.files}
        onClose={() => setSearchOpen(false)}
        onItemClick={path => {
          handleFileSelection(path);
          setSearchOpen(false);
        }}
      />
    </ContainerDiv>
  );
}
