import * as React from 'react';
import { observer } from 'mobx-react';
const SplitPane = require('react-split-pane');
import Sidebar from './components/Sidebar';
import styled from 'styled-components';
import './index.css';
import { Workspace } from './stores/Workspace';
import SummaryPanel from './components/SummaryPanel';
import DebugLink from './components/debugLink';
import Console from './components/consolePanel';
import { Tests, Debugger, Searcher } from './stores';
import MiddlePanel from './components/MiddlePanel';
import { lighten } from 'polished';

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: row;
`;

const MainWorkSpace = styled.div`
  display: flex;
  width: 100%;
  background-color: ${props => lighten(0.1, props.theme.main)} !important;
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
            <MiddlePanel workspace={workspace} tests={tests} debug={debug} />
          </SplitPane>
        </MainWorkSpace>
        <SummaryPanel workspace={workspace} tests={tests} />
        <DebugLink workspace={workspace} debug={debug} />
        {debug.isLogsAvailable && <Console debug={debug} />}
      </Container>
    );
  }
}

export default Home;
