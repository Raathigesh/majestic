import * as React from "react";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
`;

const Logo = styled.img`
  height: 60px;
  width: auto;
  padding: 4px;
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
