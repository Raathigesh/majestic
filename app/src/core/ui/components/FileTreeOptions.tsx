import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
const { Tooltip } = require('react-tippy');
import { Button } from '@blueprintjs/core';
import { Tests } from '../stores/Tests';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 20px;
  justify-content: space-between;
  font-weight: 600;
  align-self: center;
  background-color: #26282a;
  align-items: center;
`;

const RightButtons = styled.div``;

interface FileTreeOptionsProps {
  tests: Tests;
}

function FileTreeOptions({ tests }: FileTreeOptionsProps) {
  return (
    <Container>
      Tests
      <RightButtons>
        <Tooltip title={'Refresh files'} position="right" trigger="mouseenter">
          <Button
            icon="refresh"
            className="pt-small pt-minimal"
            onClick={() => {
              tests.reFetchFiles();
            }}
          />
        </Tooltip>
        <Tooltip title={'Collapse tests'} position="right" trigger="mouseenter">
          <Button
            icon="minus"
            className="pt-small pt-minimal"
            onClick={() => {
              tests.collapseTests();
            }}
          />
        </Tooltip>
      </RightButtons>
    </Container>
  );
}

export default observer(FileTreeOptions);
