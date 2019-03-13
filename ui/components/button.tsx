import React from "react";
import styled from "styled-components";
import { space, color, fontSize } from "styled-system";

const StyledButton = styled.button<any>`
  display: flex;
  align-items: center;
  border: none;
  color: #ffffff;
  text-align: center;
  transition: all 0.5s;
  border: ${props => (props.minimal ? "1px solid #0F7AD8" : null)};
  border-radius: 3px;
  background-color: ${props => (props.minimal ? "transparent" : "#0F7AD8")};
  cursor: pointer;
  margin-right: 5px;
  padding: 6px;
  ${color};
  ${fontSize};
  &:hover {
    background-color: #1992fc;
  }

  &:focus {
    outline: none;
  }
`;

const Spacer = styled.div`
  width: 5px;
`;

export default function Button(props: any) {
  return (
    <StyledButton fontSize={12} {...props}>
      {props.icon}
      {props.icon && props.children && <Spacer />}
      {props.children}
    </StyledButton>
  );
}
