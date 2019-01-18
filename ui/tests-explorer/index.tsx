import React from "react";
import styled from "styled-components";
import { useQuery, useMutation } from "react-apollo-hooks";
import {} from "styled-system";
import FileItem from "./file-item";
import WORKSPACE from "./query.gql";
import SET_SELECTED_FILE from "./set-selected-file.gql";
import { Workspace } from "../../server/api/workspace/workspace";
import { transform } from "./transformer";

const Container = styled.div``;

interface WorkspaceResult {
  workspace: Workspace;
}

interface Props {
  selectedFile: string;
  onSelectedFileChange: () => void;
}

export default function TestExplorer({
  selectedFile,
  onSelectedFileChange
}: Props) {
  const {
    data: { workspace }
  } = useQuery<WorkspaceResult>(WORKSPACE);

  const items = workspace.files;
  const root = items[0];
  const tree = transform(root, items, undefined);

  const setSelectedFile = useMutation(SET_SELECTED_FILE);

  const handleFileChange = (path: string) => {
    setSelectedFile({
      variables: {
        path
      }
    });
    onSelectedFileChange();
  };

  return (
    <Container>
      <FileItem
        item={tree}
        selectedFile={selectedFile}
        setSelectedFile={handleFileChange}
      />
    </Container>
  );
}
