import React from "react";
import styled from "styled-components";
import { space, fontSize, color } from "styled-system";
import { Shield, Folder, Code, Eye, Play } from "react-feather";
import Button from "../../components/button";

const Container = styled.div`
  ${space};
  ${color};
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const InfoContainer = styled.div`
  display: flex;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  margin-right: 15px;
`;

const InfoLabel = styled.div`
  margin-left: 5px;
`;

const FilePath = styled.div`
  ${fontSize};
  ${space};
`;

const ActionPanel = styled.div`
  display: flex;
`;

interface Props {
  path: string;
  onRun: () => void;
  onWatch: () => void;
}

export default function FileSummary({ path, onRun, onWatch }: Props) {
  return (
    <Container p={3} bg="slightDark">
      <div>
        <FilePath fontSize={15} mb={2}>
          {path}
        </FilePath>
        <InfoContainer>
          <Info>
            <Folder size={14} /> <InfoLabel>10 Suites</InfoLabel>
          </Info>
          <Info>
            <Code size={14} /> <InfoLabel>10 Tests</InfoLabel>
          </Info>
        </InfoContainer>
      </div>
      <ActionPanel>
        <Button
          onClick={() => {
            onRun();
          }}
        >
          <Play size={14} /> Run
        </Button>
        <Button
          onClick={() => {
            onWatch();
          }}
        >
          <Eye size={14} />
          Run and watch
        </Button>
      </ActionPanel>
    </Container>
  );
}
