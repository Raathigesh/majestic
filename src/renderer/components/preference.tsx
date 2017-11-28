import * as React from "react";
import { observer } from "mobx-react";
import { Button, Classes, Dialog, Tooltip } from "@blueprintjs/core";
import PreferenceStore from "../stores/Preference";

export interface PreferenceProps {
  preference: PreferenceStore;
}

function Preference({ preference }: PreferenceProps) {
  return (
    <Dialog
      iconName="inbox"
      onClose={() => {
        preference.setPreferenceOpen(false);
      }}
      title="Project preference"
      isOpen={preference.isPreferenceOpen}
    >
      <div className={Classes.DIALOG_BODY}>
        <label className="pt-label">
          Project root path
          <input
            className="pt-input pt-fill"
            type="text"
            placeholder="Root path"
            dir="auto"
            value={preference.rootPath}
            onChange={ev => {
              preference.setRootPath(ev.target.value);
            }}
          />
        </label>

        <label className="pt-label">
          Jest executable path
          <input
            className="pt-input pt-fill"
            type="text"
            placeholder="Jest executable path"
            dir="auto"
            value={preference.jestExecutablePath}
            onChange={ev => {
              preference.setJestExecutablePath(ev.target.value);
            }}
          />
        </label>

        <label className="pt-label">
          Test filename pattern
          <input
            className="pt-input pt-fill"
            type="text"
            placeholder="Test filename pattern"
            dir="auto"
            value={preference.testFileNamePattern}
            onChange={ev => {
              preference.setTestFileNamePattern(ev.target.value);
            }}
          />
        </label>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Tooltip
            content="This button is hooked up to close the dialog."
            inline={true}
          >
            <Button
              className="pt-intent-primary"
              onClick={() => {
                preference.setPreferenceOpen(false);
              }}
            >
              Primary
            </Button>
          </Tooltip>
        </div>
      </div>
    </Dialog>
  );
}

export default observer(Preference);
