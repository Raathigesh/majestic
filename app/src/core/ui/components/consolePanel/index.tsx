import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import Draggable from 'react-draggable';
import { Debugger } from '../../stores/Debugger';
import Button from '../button';
const ObjectInspector = require('react-object-inspector');

const Container = styled.div`
  width: 700px;
  height: 400px;
  position: absolute;
  right: 0;
  bottom: 0;
  box-shadow: 0 1px 1px 0 hsla(0, 0%, 0%, 0.1) !important;
  padding: 5px;
  background-color: #ebedf0;
  border-radius: 3px;
  margin: 10px;
  z-index: 999;
`;

const ClearButton = styled(Button)`
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 5px;
`;

interface ConsoleProps {
  debug: Debugger;
}

function Console({ debug }: ConsoleProps) {
  return (
    <Draggable bounds="parent">
      <Container>
        {debug.logs.map((log, i) => <ObjectInspector key={i} data={log} />)}
        <ClearButton
          label="Clear"
          onClick={() => {
            debug.clearLogs();
          }}
        />
      </Container>
    </Draggable>
  );
}

export default observer(Console);
