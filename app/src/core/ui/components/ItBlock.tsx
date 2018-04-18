import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import It from '../stores/It';
import StatusIcon from './ItStatusIcon';
import { Tooltip, Intent, Button } from '@blueprintjs/core';
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
  border-radius: 2px;
  margin-bottom: 12px;
  align-items: center;
  height: 35px;
  box-shadow: 0 1px 1px 0 hsla(0, 0%, 0%, 0.1) !important;
`;

const RightContent = styled.div`
  padding: 5px;
  flex-grow: 1;
`;

const CodePanel = styled.pre`
  color: white !important;
  background-color: #0a0724 !important;
  border: 0px !important;
  margin-top: -10px;
`;

const ExcutingLabel = styled.span`
  color: blue;
  font-weight: 400 !important;
  font-size: 12px;
`;

const TimeTakenLabel = styled.span`
  color: gray;
  font-weight: 400 !important;
  font-size: 12px;
  margin-left: 10px;
`;

interface ItBlockProps {
  itBlock: It;
  onRunTest: (it: It) => void;
  onUpdateSnapshot: () => void;
  launchInEditor: (test: It) => void;
  debugTest: () => void;
  isDebugging: boolean;
}

function ItBlock({
  itBlock,
  onRunTest,
  onUpdateSnapshot,
  launchInEditor,
  debugTest,
  isDebugging
}: ItBlockProps) {
  return (
    <Container>
      <Bar>
        <RightContent>
          <StatusIcon status={itBlock.status} />
          {itBlock.name}
          {itBlock.timeTaken > 0 && (
            <TimeTakenLabel>{itBlock.timeTaken} ms</TimeTakenLabel>
          )}
        </RightContent>
        {itBlock.executing && <ExcutingLabel>⚡ Executing</ExcutingLabel>}
        {itBlock.updatingSnapshot && (
          <ExcutingLabel>⚡ Updating snapshot</ExcutingLabel>
        )}
        {itBlock.isSnapshotFailure && (
          <Tooltip
            content={'Update snapshot'}
            className={'pt-dark'}
            intent={Intent.PRIMARY}
          >
            <button
              type="button"
              className="pt-button pt-small pt-minimal pt-icon-camera"
              onClick={() => {
                onUpdateSnapshot();
              }}
            />
          </Tooltip>
        )}
        <Tooltip
          content={'Launch editor'}
          className={'pt-dark'}
          intent={Intent.PRIMARY}
        >
          <button
            type="button"
            className="pt-button pt-small pt-minimal pt-icon-document-open"
            onClick={() => {
              launchInEditor(itBlock);
            }}
          />
        </Tooltip>
        <Tooltip
          content={'Launch a debug session'}
          className={'pt-dark'}
          intent={Intent.PRIMARY}
        >
          <Button
            type="button"
            className="pt-button pt-small pt-minimal pt-icon-pulse"
            onClick={() => {
              debugTest();
            }}
          />
        </Tooltip>
        <Tooltip
          content={'Run test'}
          className={'pt-dark'}
          intent={Intent.PRIMARY}
        >
          <button
            type="button"
            className="pt-button pt-small pt-minimal pt-icon-play"
            onClick={() => {
              onRunTest(itBlock);
            }}
          />
        </Tooltip>
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
