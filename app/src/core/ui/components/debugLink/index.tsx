import * as React from 'react';
import styled from 'styled-components';
import { Workspace } from '../../stores/Workspace';
import { observer } from 'mobx-react';
import Button from '../primitive/button';
import { Debugger } from '../../stores/Debugger';
const { Transition } = require('react-spring');
const { Copy } = require('react-feather');
const copyToClipboard = require('clipboard-copy');

const Container = styled.div`
  position: absolute;
  margin: 20px;
  right: 0;
  bottom: 0;
  width: 500px;
  border-radius: 3px;
  box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.2);
  padding: 12px;
  background-color: white;
`;

const Header = styled.div`
  font-size: 18px;
  font-weight: 600;
`;

const CancelButton = styled(Button)`
  margin-right: 10px;
`;

const Content = styled.div`
  margin-top: 5px;
  margin-bottom: 5px;
  color: ${props => props.theme.main};
  font-weight: 600;
`;

const ButtonPanel = styled.div`
  display: flex;
  justify-content: flex-end;
`;

interface DebugLinkProps {
  workspace: Workspace;
  debug: Debugger;
}

function DebugLink({ workspace, debug }: DebugLinkProps) {
  return (
    <div>
      {debug.showDebugPanel && (
        <Transition
          from={{ opacity: 0 }}
          to={{ opacity: 1 }}
          config={{ tension: 5, friction: 10 }}
        >
          {(style: any) => (
            <Container style={style}>
              <Header>Your debug session is ready</Header>
              <Content>{debug.debugUrl}</Content>
              <ButtonPanel>
                <CancelButton
                  label="Close"
                  onClick={() => {
                    debug.toggleDebugPanel(false);
                  }}
                />
                <Button
                  label="Copy"
                  primary={true}
                  icon={<Copy size={14} />}
                  onClick={() => {
                    copyToClipboard(debug.debugUrl);
                    debug.toggleDebugPanel(false);
                  }}
                />
              </ButtonPanel>
            </Container>
          )}
        </Transition>
      )}
    </div>
  );
}

export default observer(DebugLink);
