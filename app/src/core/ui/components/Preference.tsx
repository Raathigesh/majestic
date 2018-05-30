import * as React from 'react';
import styled from 'styled-components';
import Button from './button';
import { Dialog, Tabs, Tab, Switch } from '@blueprintjs/core';
import { observer } from 'mobx-react';
import { Preference } from '../stores';
const { Check } = require('react-feather');

const DoneButton = styled(Button)`
  min-width: 110px;
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

const EnableLogCheckbox = styled(Switch)`
  margin-top: 20px;
`;

function Settings({ preference }: { preference: Preference }) {
  return (
    <React.Fragment>
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
      <EnableLogCheckbox
        checked={preference.isMajesticLogEnabled}
        label="Enable Majestic.log()"
        onClick={() => {
          preference.toggleIsMajesticLogEnabled();
        }}
      />
    </React.Fragment>
  );
}

const SettingsObs = observer(Settings);

const FilledTable = styled.table`
  width: 100%;
`;

function Shortcut() {
  return (
    <FilledTable className="pt-html-table pt-interactive">
      <tbody>
        <tr>
          <td>Ctrl+B / Cmd+B</td>
          <td>Toggle the tree view</td>
        </tr>
        <tr>
          <td>Ctrl+R / Cmd+R</td>
          <td>Run current file</td>
        </tr>
      </tbody>
    </FilledTable>
  );
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
        <Tabs animate={true} id="navbar">
          <Tab
            id="Home"
            title="Settings"
            panel={<SettingsObs preference={preference} />}
          />
          <Tab id="Files" title="Shortcuts" panel={<Shortcut />} />
        </Tabs>
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
