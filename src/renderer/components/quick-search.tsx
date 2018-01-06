import * as React from "react";
import { Classes, MenuItem } from "@blueprintjs/core";
import { Omnibox } from "@blueprintjs/labs";
import { observer } from "mobx-react";
import classNames from "classnames";
import Fuse from "fuse.js";
import { Workspace } from "../stores/Workspace";
import ItBlockWithStatus from "../types/it-block";

export interface QuickSearchProps {
  workspace: Workspace;
}

const ItBlockOmniBox = Omnibox.ofType<ItBlockWithStatus>();

function QuickSearch({ workspace }: QuickSearchProps) {
  let itemId = 0;
  return (
    <ItBlockOmniBox
      isOpen={workspace.showOmni}
      resetOnSelect={true}
      noResults={<MenuItem disabled text="No results." />}
      itemRenderer={({ handleClick, isActive, item }) => {
        if (!item) {
          return <span />;
        }

        const classes = classNames({
          [Classes.ACTIVE]: isActive,
          [Classes.INTENT_PRIMARY]: isActive
        });
        return (
          <MenuItem
            className={classes}
            label={""}
            key={`${item.name}${itemId++}`}
            onClick={handleClick}
            text={`${item.name}`}
          />
        );
      }}
      items={workspace.allItBlocks()}
      onItemSelect={item => {
        if (!item) {
          return;
        }
        workspace.showOmni = false;
        workspace.highlightTestInFile(item.filePath || "", item.name);
      }}
      itemListPredicate={(query, item) => {
        if (query.trim() === "") {
          return item;
        }

        const options = {
          keys: ["name"],
          minMatchCharLength: 4,
          threshold: 0.3
        };
        const fuse = new Fuse(item, options);
        return fuse.search(query) as any;
      }}
      onClose={() => {
        workspace.showOmni = false;
      }}
      inputProps={{
        onBlur: () => {
          workspace.showOmni = false;
        }
      }}
    />
  );
}

export default observer(QuickSearch);
