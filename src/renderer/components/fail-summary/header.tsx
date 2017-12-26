import * as React from "react";
import styled from "styled-components";
import { Workspace } from "../../stores/Workspace";

const Container = styled.div`
  display: flex;
  margin-right: 15px;
  margin-left: 15px;
  justify-content: space-between;
  padding: 12px;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const Path = styled.div`
  font-size: 15px;
  color: #7e8596;
`;
const PlayButton = styled.button``;

export interface HeaderProps {
  filePath: string;
  workspace: Workspace;
}

export default function Header({ filePath, workspace }: HeaderProps) {
  return (
    <Container>
      <LeftColumn>
        <Path>{filePath}</Path>
      </LeftColumn>
      <PlayButton
        type="button"
        className="pt-button pt-minimal"
        onClick={() => {
          workspace.selectFile(filePath);
        }}
      >
        <span className="pt-icon-standard pt-icon-document-share" />
        Show file
      </PlayButton>
    </Container>
  );
}
