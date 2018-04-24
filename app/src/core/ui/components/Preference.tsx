import * as React from 'react';
import styled from 'styled-components';
import Button from './button';
import { Dialog } from '@blueprintjs/core';
import { observer } from 'mobx-react';
import { Preference } from '../stores';
const { Check } = require('react-feather');

const DoneButton = styled(Button)`
  min-width: 110px;
`;

const Heading = styled.div`
  font-size: 17px;
  margin-bottom: 20px;
`;

const Label = styled.div`
  margin-bottom: 5px;
`;

const Footer = styled.div`
  margin-top: 50px;
`;

interface PreferenceModalProps {
  preference: Preference;
}

function PreferenceModal({ preference }: PreferenceModalProps) {
  return (
    <Dialog
      icon="inbox"
      isOpen={preference.preferenceModalOpen}
      title="Dialog header"
      className="pt-dark"
    >
      <div className="pt-dialog-body">
        <Heading>Preference</Heading>
        <Label>Node executable path for majestic to use</Label>
        <div className="pt-input-group">
          <span className="pt-icon pt-icon-cog" />
          <input
            className="pt-input"
            type="input"
            placeholder="Node path"
            dir="auto"
            value={preference.nodePath}
            onChange={event => {
              preference.setNodePath(event.target.value);
            }}
          />
        </div>
      </div>
      <Footer className="pt-dialog-footer">
        <div className="pt-dialog-footer-actions">
          <DoneButton
            primary={true}
            label="Done"
            icon={<Check size={16} />}
            onClick={() => {
              preference.saveConfig();
              preference.togglePreferenceModal(false);
            }}
          />
        </div>
      </Footer>
    </Dialog>
  );
}

export default observer(PreferenceModal);
