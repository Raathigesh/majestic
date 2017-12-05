import * as React from "react";
import styled from "styled-components";
import TreeView from "./tree-view";
import Header from "./header";
import SearchBox from "./search-box";
import { observer } from "mobx-react";

const Container = styled.div`
  background-color: #fbfbfb;
  height: 100vh;
  width: 400px;
  padding: 15px;
`;

const Tab = styled.div`
  border: 1px solid #eaeaea;
  border-radius: 3px;
`;

@observer
export default class Sidebar extends React.Component<any, {}> {
  state = {
    activeTab: "tests"
  };

  render() {
    const { workspace } = this.props;
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
            Files
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
      </Container>
    );
  }
}
