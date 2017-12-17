import * as React from "react";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
`;

const Logo = styled.img`
  height: 49px;
  width: auto;
  padding: 7px;
`;

interface HeaderProps {}

const Header: React.SFC<HeaderProps> = props => {
  return (
    <Container>
      <Logo src={require("../assets/logo.png")} />
    </Container>
  );
};

export default Header;
