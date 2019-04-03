import React from "react";
import styled from "styled-components";
import { space, color, fontSize } from "styled-system";

const StyledButton = styled.button<any>`
  display: flex;
  align-items: center;
  color: ${props => (props.minimal ? "#ffffff" : "#242326")};
  text-align: center;
  transition: all 0.5s;
  border: 1px solid #ffd062;
  border-radius: 3px;
  background-color: ${props => (props.minimal ? "transparent" : "#FFD062")};
  cursor: pointer;
  margin-right: 5px;
  padding: 6px;
  ${color};
  ${fontSize};
  &:hover {
    background-color: ${props => (props.bg ? props.bg : "#ffd062")};
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
