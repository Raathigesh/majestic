import React, { useEffect, useState, Fragment } from "react";
import styled from "styled-components";
import { useMutation } from "react-apollo-hooks";
import { space, color } from "styled-system";
import FileItem from "./file-item";

import SET_WATCH_MODE from "./set-watch-mode.gql";
import { Workspace } from "../../server/api/workspace/workspace";
import { transform } from "./transformer";
import Summary from "./summary";
import { Summary as SummaryType } from "../../server/api/workspace/summary";
import RUN from "./run.gql";
import {
  Play,
  Eye,
  Search,
  RefreshCw,
  ZapOff,
  StopCircle
} from "react-feather";
import Button from "../components/button";
import { RunnerStatus } from "../../server/api/runner/status";
import Tree from "./tree";
import Logo from "./logo";

const Container = styled.div<any>`
  ${space};
  ${color};
  height: 100vh;
`;

const ActionsPanel = styled.div<any>`
  ${space}
  display: flex;
  justify-content: space-between;
`;

const RightActionPanel = styled.div`
  display: flex;
`;

const FileHeader = styled.div<any>`
  ${space}
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`;

const FilesHeader = styled.div`
  font-weight: 400;
  font-size: 11px;
`;

const RightFilesAction = styled.div`
  display: flex;
`;

interface Props {
  selectedFile: string;
  workspace: Workspace;
  summary: SummaryType;
  runnerStatus?: RunnerStatus;
  onSelectedFileChange: (path: string) => void;
  onSearchOpen: () => void;
  onRefreshFiles: () => void;
  onStop: () => void;
}

export default function TestExplorer({
  selectedFile,
  workspace,
  onSelectedFileChange,
  summary,
  runnerStatus,
  onSearchOpen,
  onRefreshFiles,
  onStop
}: Props) {
  const failedItems = (summary && summary.failedTests) || [];
  const executingItems = (summary && summary.executingTests) || [];

  const run = useMutation(RUN);

  const [collapsedItems, setCollapsedItems] = useState({});
  const handleFileToggle = (path: string, isCollapsed: boolean) => {
    setCollapsedItems({
      ...collapsedItems,
      [path]: isCollapsed
    });
  };

  const [showFailedTests, setShowFailedTests] = useState(false);

  const items = workspace.files;
  const root = items[0];
  const files = transform(
    root as any,
    executingItems,
    failedItems,
    collapsedItems,
    showFailedTests,
    items
  );

  const handleFileSelection = (path: string) => {
    onSelectedFileChange(path);
  };

  const setWatchMode = useMutation(SET_WATCH_MODE);
  const handleSetWatchModel = (watch: boolean) => {
    setWatchMode({
      variables: {
        watch
      }
    });
  };

  const isRunning = runnerStatus && runnerStatus.running;

  return (
    <Container p={4} bg="veryDark" color="text">
      <Logo />
      <ActionsPanel mb={4}>
        <Button
          icon={isRunning ? <StopCircle size={15} /> : <Play size={15} />}
          size="sm"
          onClick={() => {
            if (isRunning) {
              onStop();
            } else {
              run();
            }
          }}
        >
          {isRunning ? "Stop" : "Run tests"}
        </Button>
        <RightActionPanel>
          <Button
            icon={<Eye size={14} />}
            size="sm"
            onClick={() => {
              if (runnerStatus) {
                handleSetWatchModel(!runnerStatus.watching);
              }
            }}
          >
            {runnerStatus && runnerStatus.watching ? "Stop Watching" : "Watch"}
          </Button>
          <Button
            size="sm"
            onClick={() => {
              onSearchOpen();
            }}
          >
            <Search size={14} />
          </Button>
        </RightActionPanel>
      </ActionsPanel>
      <Summary summary={summary} />
      <FileHeader mt={4}>
        <FilesHeader>Tests</FilesHeader>
        <RightFilesAction>
          <Button
            size="sm"
            minimal
            onClick={() => {
              onRefreshFiles();
            }}
          >
            <RefreshCw size={10} />
          </Button>
          {summary.failedTests && summary.failedTests.length > 0 && (
            <Button
              size="sm"
              minimal
              onClick={() => {
                setShowFailedTests(!showFailedTests);
              }}
            >
              <ZapOff size={10} />
            </Button>
          )}
        </RightFilesAction>
      </FileHeader>
      <Tree
        results={files}
        selectedFile={selectedFile}
        onFileSelection={handleFileSelection}
        onToggle={handleFileToggle}
      />
    </Container>
  );
}
