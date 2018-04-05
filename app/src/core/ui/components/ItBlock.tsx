import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import It from '../stores/It';
import StatusIcon from './ItStatusIcon';
var Convert = require('ansi-to-html');
var convert = new Convert();

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Bar = styled.div`
  display: flex;
  background-color: white;
  color: #0a0724;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid #ebebeb;
  border-radius: 2px;
  margin-bottom: 10px;
  align-items: center;
  height: 35px;
`;

const RightContent = styled.div`
  padding: 5px;
  flex-grow: 1;
`;

const CodePanel = styled.pre`
  color: white !important;
  background-color: #0a0724 !important;
  border: 0px !important;
`;

interface ItBlockProps {
  itBlock: It;
  onRunTest: () => void;
}

function ItBlock({ itBlock, onRunTest }: ItBlockProps) {
  return (
    <Container>
      <Bar>
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
      </Bar>
      {itBlock.failureMessage && (
        <CodePanel
          dangerouslySetInnerHTML={{
            __html: convert.toHtml(itBlock.failureMessage)
          }}
        />
      )}
    </Container>
  );
}

export default observer(ItBlock);
