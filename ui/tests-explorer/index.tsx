import React from "react";
import styled from "styled-components";
import { useQuery } from "react-apollo-hooks";
import {} from "styled-system";
import FileItem from "./file-item";
import WORKSPACE from "./query.gql";
import { Workspace } from "../../server/api/workspace/workspace";
import { transform } from "./transformer";

const Container = styled.div``;

export default function TestExplorer() {
  const { data } = useQuery<{ workspace: Workspace }>(WORKSPACE);
  const items = data.workspace.files;
  const root = items[0];
  const tree = transform(root, items, undefined);
  return (
    <Container>
      <FileItem item={tree} />
    </Container>
  );
}
