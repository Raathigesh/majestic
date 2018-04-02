import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import It from '../stores/It';
import StatusIcon from './ItStatusIcon';

const Container = styled.div`
  display: flex;
  background-color: white;
  color: #0a0724;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0px 1px 0px 0px #d3cffb;
  border: 1px solid #d3cffb;
  border-radius: 2px;
  margin-bottom: 10px;
`;

const RightContent = styled.div`
  padding: 5px;
  flex-grow: 1;
`;

interface ItBlockProps {
  itBlock: It;
  onRunTest: () => void;
}

function ItBlock({ itBlock, onRunTest }: ItBlockProps) {
  return (
    <Container>
      <RightContent>
        <StatusIcon status={itBlock.status} />
        {itBlock.name}
      </RightContent>
      <button
        type="button"
        className="pt-button pt-small pt-minimal pt-icon-play"
        onClick={() => {
          onRunTest();
        }}
      />
    </Container>
  );
}

export default observer(ItBlock);
