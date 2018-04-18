import * as React from 'react';
import { observer } from 'mobx-react';
const SplitPane = require('react-split-pane');
import Sidebar from './components/Sidebar';
import styled from 'styled-components';
import './index.css';
import { Workspace } from './stores/Workspace';
import TestFile from './components/TestFile';
import SummaryPanel from './components/SummaryPanel';
import It from './stores/It';
import Node from './stores/Node';
import DebugLink from './components/debugLink';
import Console from './components/consolePanel';
import { Tests } from './stores/Tests';
import { Debugger } from './stores/Debugger';
import { Searcher } from './stores/Searcher';

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
  tests: Tests;
  debug: Debugger;
  searcher: Searcher;
}

@observer
class Home extends React.Component<HomeProps, {}> {
  public render() {
    const { workspace, tests, debug, searcher } = this.props;
    return (
      <Container className="Home">
        <MainWorkSpace>
          <SplitPane
            paneStyle={{ position: 'inherit' }}
            split="vertical"
            minSize={320}
            defaultSize={320}
          >
            <Sidebar tests={tests} searcher={searcher} />
            {tests.selectedTest && (
              <TestFile
                testFile={tests.selectedTest}
                onRunTest={(it: It) => {
                  if (!tests.selectedTest) {
                    return;
                  }
                  workspace.runTest(tests.selectedTest, it);
                }}
                onRunFile={() => {
                  workspace.runFile(tests.selectedTest);
                }}
                onUpdateSnapshot={workspace.updateSnapshot}
                launchEditor={(it: It, testFileName: Node) => {
                  debug.launchInEditor(testFileName, it);
                }}
                debugTest={(it: It, testFileName: Node) => {
                  debug.startDebugging(testFileName, it);
                }}
                isDebugging={debug.running}
              />
            )}
          </SplitPane>
        </MainWorkSpace>
        <SummaryPanel workspace={workspace} tests={tests} />
        <DebugLink workspace={workspace} debug={debug} />
        <Console />
      </Container>
    );
  }
}

export default Home;
