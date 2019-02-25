import React from "react";
import styled from "styled-components";
import { space, color, fontSize } from "styled-system";

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  border-radius: 2px;
  border: none;
  color: #ffffff;
  text-align: center;
  transition: all 0.5s;
  cursor: pointer;
  ${space};
  ${color};
  ${fontSize};
  &:hover {
    background-color: white;
  }
`;

export default function Button(props: any) {
  return <StyledButton bg="button" p={1} fontSize={10} {...props} />;
}
