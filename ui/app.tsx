import React, { Suspense } from "react";
import styled from "styled-components";
import SplitPane from "react-split-pane";
import { useQuery } from "react-apollo-hooks";
import TestExplorer from "./tests-explorer";
import TestFile from "./test-file";

import APP from "./app.gql";

const ContainerDiv = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
`;

const Main = styled.div`
  display: flex;
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
  return (
    <ContainerDiv>
      <SplitPane split="vertical" defaultSize={550} primary="second">
        <Main>
          <TestExplorer
            selectedFile={selectedFile}
            onSelectedFileChange={refetch}
          />
          <TestFile selectedFilePath={selectedFile} />
        </Main>
        <div />
      </SplitPane>
    </ContainerDiv>
  );
}
