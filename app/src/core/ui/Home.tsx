import * as React from 'react';
import { observer } from 'mobx-react';
const SplitPane = require('react-split-pane');
import Sidebar from './components/Sidebar';
import styled from 'styled-components';
import './index.css';
import Workspace from './stores/Workspace';
import TestFile from './components/TestFile';
import SummaryPanel from './components/SummaryPanel';

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: row;
`;

const MainWorkSpace = styled.div`
  display: flex;
  width: 100%;
`;

interface HomeProps {
  workspace: Workspace;
}

@observer
class Home extends React.Component<HomeProps, {}> {
  public render() {
    const { workspace } = this.props;
    return (
      <Container className="Home">
        <MainWorkSpace>
          <SplitPane
            paneStyle={{ position: 'inherit' }}
            split="vertical"
            minSize={320}
            defaultSize={320}
          >
            <Sidebar workspace={workspace} />
            {workspace.tests.selectedTest && (
              <TestFile
                testFile={workspace.tests.selectedTest}
                onRunTest={() => {
                  workspace.run();
                }}
                onRunFile={() => {
                  workspace.runFile(workspace.tests.selectedTest);
                }}
              />
            )}
          </SplitPane>
        </MainWorkSpace>
        <SummaryPanel workspace={workspace} />
      </Container>
    );
  }
}

export default Home;
