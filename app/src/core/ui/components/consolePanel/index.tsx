import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import Draggable from 'react-draggable';
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

function Console() {
  return (
    <Draggable bounds="parent">
      <Container>
        <ObjectInspector data={{ value: 3 }} />
        <ObjectInspector data={{ value: 3 }} />
        <ObjectInspector data={{ value: 3 }} />
      </Container>
    </Draggable>
  );
}

export default observer(Console);
