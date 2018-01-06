import * as React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import Sidebar from "./components/sidebar";
import Content from "./components/content";
import PreferenceModal from "./components/preference";
const SplitPane = require("react-split-pane");
import QuickSearch from "./components/quick-search";
import ConsolePanel from "./components/debugging/console-panel";

const ContainerDiv = styled.div`
  display: flex;
`;

function Container({ updater, workspace }) {
  return (
    <ContainerDiv>
      <ConsolePanel workspace={workspace} />
      <QuickSearch workspace={workspace} />
      <SplitPane
        split="vertical"
        minSize={workspace.showSidebar ? 300 : 0}
        defaultSize={workspace.showSidebar ? 400 : 0}
      >
        {workspace.showSidebar ? (
          <Sidebar updater={updater} workspace={workspace} />
        ) : (
          <div />
        )}
        <Content workspace={workspace} preference={workspace.preference} />
      </SplitPane>
      <PreferenceModal preference={workspace.preference} />
    </ContainerDiv>
  );
}

export default observer(Container);
