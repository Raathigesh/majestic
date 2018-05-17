import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { lighten } from 'polished';
const { Scrollbars } = require('react-custom-scrollbars');
import { Node } from '../../stores';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  flex-grow: 1;
  background-color: ${props => props.theme.main} !important;
`;

const FileItem = styled.div`
  padding: 3px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 3px;
  border-radius: 3px;
  background-color: ${props => lighten(0.1, props.theme.main)} !important;
  &:hover {
    background-color: ${props =>
      lighten(0.1, props.theme.extra.mars)} !important;
    color: ${props => props.theme.main} !important;
  }
`;

const Title = styled.div`
  font-size: 16px;
  margin-bottom: 5px;
`;

interface FailedTests {
  failedTetsts: Node[];
  onChangeCurrentSelection: (path: string) => void;
}

function FailedTests({ failedTetsts, onChangeCurrentSelection }: FailedTests) {
  return (
    <Container>
      {failedTetsts.length > 0 && (
        <React.Fragment>
          <Title>Failed Tests</Title>
          <Scrollbars style={{ flexGrow: '1' }}>
            {failedTetsts.map(test => {
              return (
                <FileItem
                  key={test.path}
                  onClick={() => {
                    onChangeCurrentSelection(test.path);
                  }}
                >
                  {test.path}
                </FileItem>
              );
            })}
          </Scrollbars>
        </React.Fragment>
      )}
    </Container>
  );
}

export default observer(FailedTests);
