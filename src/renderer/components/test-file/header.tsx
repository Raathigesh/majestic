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

const Name = styled.div`
  font-size: 20px;
  margin-bottom: 5px;
`;
const Path = styled.div`
  font-size: 15px;
  color: #7e8596;
`;
const PlayButton = styled.button``;

export interface HeaderProps {
  workspace: Workspace;
}

export default function Header({ workspace }: HeaderProps) {
  return (
    <Container>
      <LeftColumn>
        <Name>{workspace.selectedTest && workspace.selectedTest.label}</Name>
        <Path>{workspace.selectedTest && workspace.selectedTest.path}</Path>
      </LeftColumn>
      {workspace.selectedTest && (
        <PlayButton
          type="button"
          className="pt-button pt-minimal"
          onClick={() => {
            workspace.runCurrentFile();
          }}
        >
          <span className="pt-icon-standard pt-icon-play" />
          Run this file
        </PlayButton>
      )}
    </Container>
  );
}
