import * as React from "react";
import Preference from "../stores/Preference";
import { Workspace } from "../stores/Workspace";

export interface EmptyContentProps {
  preference: Preference;
  workspace: Workspace;
}

export default function EmptyContent({
  preference,
  workspace
}: EmptyContentProps) {
  return (
    <div className="pt-non-ideal-state">
      <div className="pt-non-ideal-state-visual pt-non-ideal-state-icon">
        <span className="pt-icon pt-icon-helper-management" />
      </div>
      <h4 className="pt-non-ideal-state-title">It's empty in here</h4>
      <div className="pt-non-ideal-state-description">
        Select a test file from the sidebar.
      </div>
      <button
        type="button"
        className="pt-button"
        onClick={() => {
          workspace.openProject();
        }}
      >
        <span className="pt-icon-standard pt-icon-folder-open" />
        Open Project
      </button>
      <h4 className="pt-non-ideal-state-title">
        Press Ctrl or Cmd + Space for quick search
      </h4>
    </div>
  );
}
