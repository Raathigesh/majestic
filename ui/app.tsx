import React from "react";
import styled from "styled-components";
import SplitPane from "react-split-pane";

const ContainerDiv = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
`;

export default class App extends React.Component {
  render() {
    return (
      <ContainerDiv>
        <SplitPane split="vertical" defaultSize={400}>
          <SplitPane split="vertical" defaultSize={350} primary="second">
            <div />
            <div />
          </SplitPane>
        </SplitPane>
      </ContainerDiv>
    );
  }
}
