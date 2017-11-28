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
  if (status === "Unknown") {
    iconName = "pt-icon-ring";
  } else if (status === "KnownSuccess") {
    iconName = "pt-icon-tick-circle";
  } else if (status === "KnownFail") {
    iconName = "pt-icon-error";
  } else if (status === "KnownSkip") {
    iconName = "pt-icon-record";
  }

  return (
    <Container>
      {!isExecuting && <Icon iconName={iconName} iconSize={16} />}
      {isExecuting && (
        <svg
          version="1.1"
          id="loader-1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="20px"
          height="20px"
          viewBox="0 0 50 50"
        >
          <path
            fill="blue"
            d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z"
          >
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="0.6s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      )}
    </Container>
  );
}
