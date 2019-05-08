import React, { useState } from "react";
import styled from "styled-components";
import SplitPane from "react-split-pane";
import { useQuery, useMutation } from "react-apollo-hooks";
import Sidebar from "./sidebar";
import TestFile from "./test-file";
import APP from "./app.gql";
import WORKSPACE from "./query.gql";
import useKeys from "./hooks/use-keys";
import useSubscription from "./test-file/use-subscription";
import SUMMARY_QUERY from "./summary-query.gql";
import SUMMARY_SUBS from "./summary-subscription.gql";
import RUNNER_STATUS_QUERY from "./runner-status-query.gql";
import RUNNER_STATUS_SUBS from "./runner-status-subs.gql";
import STOP_RUNNER from "./stop-runner.gql";
import { Search } from "./search";
import SET_SELECTED_FILE from "./set-selected-file.gql";
import { Workspace } from "../server/api/workspace/workspace";
import { color } from "styled-system";
import { RunnerStatus } from "../server/api/runner/status";
import { Summary } from "../server/api/workspace/summary";
import CoveragePanel from "./coverage-panel";

const ContainerDiv = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const PlaceHolder = styled.div<any>`
  display: flex;
  height: 100%;
  ${color}
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

  const { data: summary }: { data: Summary } = useSubscription(
    SUMMARY_QUERY,
    SUMMARY_SUBS,
    {},
    result => result.summary,
    result => result.changeToSummary,
    "Summary Sub"
  );

  const { data: runnerStatus }: { data: RunnerStatus } = useSubscription(
    RUNNER_STATUS_QUERY,
    RUNNER_STATUS_SUBS,
    {},
    result => result.runnerStatus,
    result => result.runnerStatusChange,
    "Runner subs"
  );

  const setSelectedFile = useMutation(SET_SELECTED_FILE);
  const handleFileSelection = (path: string | null) => {
    if (path !== null) {
      setShowCoverage(false);
    }

    setSelectedFile({
      variables: {
        path
      }
    });
    refetch();
  };

  const stopRunner = useMutation(STOP_RUNNER);

  const [isSearchOpen, setSearchOpen] = useState(false);
  const keys = useKeys();
  if (isSearchOpen && keys.has("Escape")) {
    setSearchOpen(false);
  }

  const [showCoverage, setShowCoverage] = useState(false);

  return (
    <ContainerDiv>
      <SplitPane
        defaultSize={"calc(100% - 300px)"}
        split="vertical"
        primary="second"
        pane1Style={{ minWidth: "300px" }}
        pane2Style={{ maxWidth: "calc(100% - 300px)" }}
      >
        <Sidebar
          workspace={workspace}
          selectedFile={selectedFile}
          onSelectedFileChange={handleFileSelection}
          summary={summary}
          runnerStatus={runnerStatus}
          showCoverage={showCoverage}
          onSearchOpen={() => {
            setSearchOpen(true);
          }}
          onRefreshFiles={() => {
            refetchFiles();
          }}
          onStop={() => {
            stopRunner();
          }}
          onShowCoverage={() => {
            setShowCoverage(!showCoverage);            
          }}
        />
        {showCoverage && <CoveragePanel />}
        {selectedFile ? (
          <TestFile
            projectRoot={workspace.projectRoot}
            selectedFilePath={selectedFile}
            isRunning={
              (runnerStatus.running &&
                runnerStatus.activeFile === selectedFile) ||
              ((summary && summary.executingTests) || []).includes(selectedFile)
            }
            onStop={() => {
              stopRunner();
            }}
          />
        ) : (
          <PlaceHolder bg="dark" />
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
