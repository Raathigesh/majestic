import * as React from 'react';
import styled from 'styled-components';
import { Tooltip, Intent } from '@blueprintjs/core';
import { lighten, darken } from 'polished';
const { ChevronUp, ChevronDown, Trash } = require('react-feather');
import Console from '../consolePanel';
import { Debugger } from '../../stores';
import { observer } from 'mobx-react';

const Container = styled.div`
  background-color: ${props => lighten(0.1, props.theme.main)};
`;

const Handle = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${props => darken(0.1, props.theme.main)};
`;

const ToggleButton = styled.div`
  margin-top: 7px;
  margin-right: 5px;
  margin-left: 5px;

  > svg {
    cursor: pointer;

    &:hover {
      stroke: gray;
    }
  }
`;

const ToggleButtons = styled.div`
  display: flex;
  flex-direction: row;
`;

const TabHandle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 5px;
  padding-top: 7px;
  padding-left: 10px;
  width: 92px;
  font-weight: 600;
  background-color: ${props => darken(0.1, props.theme.main)};
  color: ${props => props.theme.text};
  cursor: pointer;
`;

const ConsoleCount = styled.div`
  background-color: ${props => props.theme.extra.mars};
  border-radius: 30px;
  color: black;
  font-size: 11px;
  padding: 2px;
  font-weight: 600;
  padding-right: 6px;
  padding-left: 6px;
`;

interface TabsProps {
  debug: Debugger;
}

interface TabsState {
  open: boolean;
}

@observer
export default class Tabs extends React.Component<TabsProps, TabsState> {
  state: TabsState = {
    open: false
  };

  handleClick = () => {
    this.setState({
      open: !this.state.open
    });
  };

  clearConsole = () => {
    this.props.debug.clearLogs();
  };

  render() {
    const { debug } = this.props;
    return (
      <Container>
        <Handle>
          <TabHandle onClick={this.handleClick}>
            Console
            {debug.isLogsAvailable && (
              <ConsoleCount>{debug.logs.length}</ConsoleCount>
            )}
          </TabHandle>
          <ToggleButtons>
            {debug.isLogsAvailable && (
              <ToggleButton onClick={this.clearConsole}>
                <Tooltip
                  content={'Clear console logs'}
                  className={'pt-dark'}
                  intent={Intent.PRIMARY}
                >
                  <Trash size={12} color={'white'} />
                </Tooltip>
              </ToggleButton>
            )}
            <ToggleButton onClick={this.handleClick}>
              {this.state.open && <ChevronDown size={17} color={'white'} />}
              {!this.state.open && <ChevronUp size={17} color={'white'} />}
            </ToggleButton>
          </ToggleButtons>
        </Handle>
        {this.state.open && <Console debug={debug} />}
      </Container>
    );
  }
}
