import * as React from "react";
import { Icon, IconName } from "@blueprintjs/core";
import styled from "styled-components";
import { InternalTestReconcilationState } from "../../types/node-type";

export interface IndicatorProps {
  isExecuting: boolean;
  status: InternalTestReconcilationState;
}

const Container = styled.div`
  margin-right: 5px;
`;

export default function Indicator({ status, isExecuting }: IndicatorProps) {
  let iconName: null | string = null;
  if (status === "KnownSuccess") {
    iconName = "pt-icon-tick-circle";
  } else if (status === "KnownFail") {
    iconName = "pt-icon-symbol-circle";
  } else if (status === "KnownSkip") {
    iconName = "pt-icon-record";
  }

  return (
    <Container>
      {iconName && <Icon iconName={iconName as IconName} iconSize={16} />}
    </Container>
  );
}
