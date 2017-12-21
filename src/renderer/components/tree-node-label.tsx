import * as React from "react";
import { TestReconcilationState } from "jest-editor-support";
import { Icon, IconName } from "@blueprintjs/core";
import styled from "styled-components";

export default function getLabel(coverage: string) {
  return <span>{coverage}</span>;
}

const CustomIcon = styled(Icon)`
  color: #5c7080;
`;

export function getTestStatusLabel(status: TestReconcilationState) {
  let icon = "";
  if (status === "KnownSuccess") {
    icon = "pt-icon-tick";
  } else if (status === "KnownFail") {
    icon = "pt-icon-issue";
  }

  return <CustomIcon iconName={icon as IconName} />;
}
