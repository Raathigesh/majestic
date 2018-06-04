import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #c1c1ff;
  border-radius: 5px;
  padding: 15px;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
`;

const Logo = styled.div`
  display: flex;
  border-radius: 50%;
  width: 70px;
  align-items: center;
  height: 70px;
  justify-content: center;
  background-color: #3e4245;
  margin-top: -35px;
`;

const Header = styled.div`
  font-size: 30px;
`;
const Description = styled.div``;

export default ({ header, desc, logo }) => (
  <Container>
    <Logo>
      <img src={logo} />
    </Logo>
    <Header>{header}</Header>
    <Description>{desc}</Description>
  </Container>
);
