import * as React from "react";
import styled from "styled-components";
import { Tab2, Tabs2 } from "@blueprintjs/core";
import TreeView from "./tree-view";
import Header from "./header";
import SearchBox from "./search-box";
import ActionPanel from "./action-panel";
import { observer } from "mobx-react";

const Container = styled.div`
  background-color: #f6f6f6;
  height: 100vh;
  width: 400px;
  padding: 5px;
`;

function Sidebar({ workspace, preference }) {
  return (
    <Container>
      <Header />
      <ActionPanel
        workspace={workspace}
        onRunTests={() => {
          workspace.runProject();
        }}
        onPreferenceToggle={() => {
          preference.setPreferenceOpen(true);
        }}
      />
      <SearchBox
        onSearch={(query: string) => {
          workspace.search(query);
        }}
      />
      <Tabs2 id="Tabs2Example">
        <Tab2
          id="rx"
          title="Tests"
          panel={
            <TreeView
              workspace={workspace}
              files={workspace.files && workspace.files.testFiles()}
            />
          }
        />
        <Tab2
          id="ng"
          title="Files"
          panel={
            <TreeView
              workspace={workspace}
              files={workspace.files && workspace.files.allFiles()}
            />
          }
        />
      </Tabs2>
    </Container>
  );
}

export default observer(Sidebar);
