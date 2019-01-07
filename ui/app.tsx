import React, { Suspense } from "react";
import styled from "styled-components";
import SplitPane from "react-split-pane";
import TestExplorer from "./tests-explorer";
import TestFile from "./test-file";

const ContainerDiv = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
`;

const Main = styled.div`
  display: flex;
`;

export default class App extends React.Component {
  render() {
    return (
      <ContainerDiv>
        <SplitPane split="vertical" defaultSize={550} primary="second">
          <Main>
            <Suspense fallback={<div>Loading...</div>}>
              <TestExplorer />
              <TestFile />
            </Suspense>
          </Main>
          <div />
        </SplitPane>
      </ContainerDiv>
    );
  }
}
