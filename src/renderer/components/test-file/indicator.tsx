import * as React from "react";
import { Icon, IconName } from "@blueprintjs/core";
import { TestReconcilationState } from "jest-editor-support";
import styled from "styled-components";

export interface IndicatorProps {
  isExecuting: boolean;
  status: TestReconcilationState;
}

const Container = styled.div`
  margin-right: 5px;
`;

export default function Indicator({ status, isExecuting }: IndicatorProps) {
  let iconName: IconName = "pt-icon-ring";
  if (status === "KnownSuccess") {
    iconName = "pt-icon-tick-circle";
  } else if (status === "KnownFail") {
    iconName = "pt-icon-error";
  } else if (status === "KnownSkip") {
    iconName = "pt-icon-record";
  }

  return (
    <Container>
      <Icon iconName={iconName} iconSize={16} />
    </Container>
  );
}
