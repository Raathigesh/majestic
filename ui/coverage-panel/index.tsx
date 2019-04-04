import React from "react";
import styled from "styled-components";
import { getAPIUrl } from "../apollo-client";

const Frame = styled.iframe`
  width: 100%;
  height: 100%;
`;

export default function CoveragePanel() {
  return (
    <Frame
      src={`${getAPIUrl()}/coverage/lcov-report/index.html`}
      frameBorder="0"
    />
  );
}
