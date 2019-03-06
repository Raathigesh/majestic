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
  border: ${props => (props.minimal ? null : "1px solid #ff4954")};
  border-radius: 3px;
  height: 25px;
  cursor: pointer;
  margin-right: 5px;
  ${space};
  ${color};
  ${fontSize};
  &:hover {
    background-color: #ff4954;
  }

  &:focus {
    outline: none;
  }
`;

export default function Button(props: any) {
  return <StyledButton p={1} fontSize={12} {...props} />;
}
