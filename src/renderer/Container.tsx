import * as React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import Sidebar from "./components/sidebar";
import Content from "./components/content";
import PreferenceModal from "./components/preference";
import DevTools from "mobx-react-devtools";
import SplitPane from "react-split-pane";
import QuickSearch from "./components/quick-search";

const ContainerDiv = styled.div`
  display: flex;
`;

function Container({ updater, workspace }) {
  return (
    <ContainerDiv>
      <DevTools />
      <QuickSearch workspace={workspace} />
      <SplitPane split="vertical" minSize={400} defaultSize={400}>
        <Sidebar updater={updater} workspace={workspace} />
        <Content workspace={workspace} preference={workspace.preference} />
      </SplitPane>
      <PreferenceModal preference={workspace.preference} />
    </ContainerDiv>
  );
}

export default observer(Container);
