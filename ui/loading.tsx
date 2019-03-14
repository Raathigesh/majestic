import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: #262529;
  color: #fdc055;
  font-size: 25px;
  font-weight: 500;
`;

export default function Loading() {
  return <Container>Getting things ready for ya...</Container>;
}
