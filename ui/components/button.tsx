import React from "react";
import styled from "styled-components";
import { space, color, fontSize } from "styled-system";

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  border: none;
  color: #ffffff;
  text-align: center;
  transition: all 0.5s;
  background-color: transparent;
  border: 1.5px solid #0080da;
  border-radius: 3px;
  cursor: pointer;
  ${space};
  ${color};
  ${fontSize};
  &:hover {
    background-color: #0080da;
  }
`;

export default function Button(props: any) {
  return <StyledButton p={1} fontSize={12} {...props} />;
}
