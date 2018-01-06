import * as React from "react";
import styled from "styled-components";
import TreeView from "./tree-view";
import Header from "./header";
import SearchBox from "./search-box";
import { observer } from "mobx-react";
import { Intent, ProgressBar } from "@blueprintjs/core";
import { Updater, UpdaterStatus } from "../stores/Updater";
import { Workspace } from "../stores/Workspace";

const Container = styled.div`
  height: 100vh;
  min-width: 300px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ececec;
  background-color: #f5f6fa;
`;

const Tab = styled.div`
  border: 1px solid #eaeaea;
  border-radius: 3px;
  min-height: 30px;
  margin-bottom: 3px;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  border-radius: 3px;
  min-height: 50px;
  margin-top: 10px;
`;

const FooterText = styled.div`
  text-align: center;
  margin-bottom: 5px;
  font-size: 13px;
  display: flex;
  flex-direction: column;
`;

const UpdateLabel = styled.div`
  font-size: 12px;
  text-align: center;
  margin-bottom: 5px;
`;

export interface ISidebarProps {
  updater: Updater;
  workspace: Workspace;
}

export interface ISidebarState {
  activeTab: string;
}

class Sidebar extends React.Component<ISidebarProps, ISidebarState> {
  state = {
    activeTab: "tests"
  };

  render() {
    const { workspace, updater } = this.props;
    return (
      <Container>
        <Header />
        <SearchBox
          onSearch={(query: string) => {
            workspace.search(query);
          }}
        />
        <Tab className="pt-button-group pt-minimal pt-fill">
          <a
            className={`pt-button pt-icon-form ${
              this.state.activeTab === "tests" ? "pt-active" : ""
            }`}
            onClick={() => {
              this.setState({
                activeTab: "tests"
              });
            }}
          >
            Tests
          </a>
          <a
            className={`pt-button pt-icon-document ${
              this.state.activeTab === "files" ? "pt-active" : ""
            }`}
            onClick={() => {
              this.setState({
                activeTab: "files"
              });
            }}
          >
            Coverage
          </a>
        </Tab>

        {this.state.activeTab === "tests" ? (
          <TreeView
            workspace={workspace}
            files={workspace.files && workspace.files.testFiles}
          />
        ) : (
          <TreeView
            workspace={workspace}
            files={workspace.files && workspace.files.allFiles}
          />
        )}

        <Footer>
          <FooterText>Version {updater.currentVersion}</FooterText>

          {updater.updateStatus === UpdaterStatus.NoUpdate && (
            <button
              type="button"
              className="pt-button pt-icon-satellite pt-small pt-minimal"
              onClick={updater.checkForUpdate}
            >
              Check for updates
            </button>
          )}
          {updater.updateStatus === UpdaterStatus.CheckingUpdate && (
            <UpdateLabel>Checking for update</UpdateLabel>
          )}

          {updater.updateStatus ===
            UpdaterStatus.UpdateAvailableForDownload && (
            <button
              type="button"
              className="pt-button pt-icon-download pt-small pt-minimal"
              onClick={() => {
                updater.downloadUpdate();
              }}
            >
              Download and Install
            </button>
          )}
          {updater.updateStatus === UpdaterStatus.DownloadingUpdate && (
            <UpdateLabel>Downloading update</UpdateLabel>
          )}
          {updater.updateStatus === UpdaterStatus.DownloadingUpdate && (
            <ProgressBar
              intent={Intent.PRIMARY}
              value={updater.progress / 100}
            />
          )}

          {updater.updateStatus === UpdaterStatus.InstallingUpdate && (
            <UpdateLabel>Installing update</UpdateLabel>
          )}
        </Footer>
      </Container>
    );
  }
}

export default observer(Sidebar);
