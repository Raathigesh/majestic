import * as React from "react";
import { observer } from "mobx-react";
import { Button, Classes, Dialog, Checkbox } from "@blueprintjs/core";
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
        <Checkbox
          label="Log to in-built console (Experimental)"
          checked={preference.logToInbuiltConsole}
          onChange={() => {
            preference.setLogToInbuiltConsole(!preference.logToInbuiltConsole);
          }}
        />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            className="pt-intent-primary"
            onClick={() => {
              preference.setPreferenceOpen(false);
            }}
          >
            Done
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default observer(Preference);
