import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { Debugger } from '../../stores/Debugger';
import { darken } from 'polished';
import theme from '../../theme';
const { ObjectInspector, chromeDark } = require('react-inspector');
const { Scrollbars } = require('react-custom-scrollbars');

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 300px;
  padding: 5px;
  background-color: ${props => darken(0.1, props.theme.main)};
  box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.2) !important;
`;

const LogEntry = styled.div`
  margin-bottom: 4px;
`;

const Info = styled.div`
  color: ${props => props.theme.text};
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  height: 100%;
  font-size: 15px;

  & span {
    font-weight: 600;
    color: ${props => props.theme.main};
    background-color: ${props => props.theme.extra.mars};
    border-radius: 4px;
    padding-left: 5px;
    padding-right: 5px;
  }
`;

interface ConsoleProps {
  debug: Debugger;
}

function Console({ debug }: ConsoleProps) {
  return (
    <Container>
      {debug.isLogsAvailable && (
        <Scrollbars style={{ height: '400px' }}>
          {debug.logs.map((log, i) => (
            <LogEntry>
              <ObjectInspector
                theme={{
                  ...chromeDark,
                  ...{
                    BASE_BACKGROUND_COLOR: darken(0.1, theme.main),
                    TREENODE_FONT_SIZE: '13px'
                  }
                }}
                key={i}
                data={log}
              />
            </LogEntry>
          ))}
          />
        </Scrollbars>
      )}
      {!debug.isLogsAvailable && (
        <Info>
          <div>
            Use <span>majestic.log()</span> in your tests and inspect them here
          </div>
        </Info>
      )}
    </Container>
  );
}

export default observer(Console);
