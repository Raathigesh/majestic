import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
  padding-bottom: 30px;
`;

const Logo = styled.div`
  display: flex;
  flex-direction: row;
  font-family: "Montserrat", sans-serif;
  font-size: 36px;
  align-items: center;
`;

const Menus = styled.div`
  display: flex;
  flex-direction: row;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  align-items: center;
`;

const Menu = styled.div`
  cursor: pointer;
  color: #26282a;
  margin-right: 10px;
  padding: 3px;

  &: hover {
    background-color: #fdbf07;
  }
`;

export default () => {
  return (
    <Container>
      <Logo>
        <img src={require("../../assets/logo.png")} />
        Majestic
      </Logo>
      <Menus>
        <Menu>Docs</Menu>
        <Menu>Github</Menu>
      </Menus>
    </Container>
  );
};
