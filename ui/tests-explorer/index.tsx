import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useQuery, useMutation } from "react-apollo-hooks";
import { space, color } from "styled-system";
import FileItem from "./file-item";
import WORKSPACE from "./query.gql";
import SET_SELECTED_FILE from "./set-selected-file.gql";
import { Workspace } from "../../server/api/workspace/workspace";
import { transform } from "./transformer";
import Summary from "./summary";
import { Summary as SummaryType } from "../../server/api/workspace/summary";
import RUN from "./run.gql";
import { Play, Eye } from "react-feather";
import Button from "../components/button";
import useSubscription from "../test-file/use-subscription";

const Container = styled.div`
  ${space};
  ${color};
  height: 100vh;
`;

const ActionsPanel = styled.div`
  display: flex;
`;

interface WorkspaceResult {
  workspace: Workspace;
}

interface Props {
  selectedFile: string;
  summary: SummaryType;
  onSelectedFileChange: () => void;
}

export default function TestExplorer({
  selectedFile,
  onSelectedFileChange,
  summary
}: Props) {
  const {
    data: { workspace }
  } = useQuery<WorkspaceResult>(WORKSPACE);

  const items = workspace.files;
  const root = items[0];
  const tree = transform(root, items, undefined);
  const run = useMutation(RUN);

  const [collapsedItems, setCollapsedItems] = useState({});
  const handleFileToggle = (path: string, isCollapsed: boolean) => {
    setCollapsedItems({
      ...collapsedItems,
      [path]: isCollapsed
    });
  };

  const setSelectedFile = useMutation(SET_SELECTED_FILE);
  const handleFileSelection = (path: string) => {
    setSelectedFile({
      variables: {
        path
      }
    });
    onSelectedFileChange();
  };

  return (
    <Container p={4} bg="dark" color="text">
      <ActionsPanel>
        <Button
          size="sm"
          onClick={() => {
            run();
          }}
        >
          <Play size={14} /> Run tests
        </Button>
        <Button
          size="sm"
          onClick={() => {
            run();
          }}
        >
          <Eye size={14} /> Run tests
        </Button>
      </ActionsPanel>
      <Summary summary={summary} />
      <FileItem
        item={tree}
        selectedFile={selectedFile}
        setSelectedFile={handleFileSelection}
        collapsedItems={collapsedItems}
        isCollapsed={collapsedItems[tree.path]}
        onToggle={handleFileToggle}
      />
    </Container>
  );
}
