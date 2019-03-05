import React from "react";
import styled from "styled-components";

const Drop = styled.div`
  position: absolute;
  background-color: #444444;
  opacity: 0.7;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0px;
  z-index: 1;
`;

const Container = styled.div`
  width: 700px;
  height: 500px;
  position: absolute;
  background-color: wheat;
  z-index: 1;
  margin-left: auto;
  margin-right: auto;
  opacity: ;
  left: 0;
  right: 0;
  top: 150px;
`;

export function Search() {
  return (
    <React.Fragment>
      <Drop />
      <Container>Hello</Container>
    </React.Fragment>
  );
}
