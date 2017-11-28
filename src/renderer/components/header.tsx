import * as React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 100px;
  padding: 20px;
  text-align: center;
`;

interface HeaderProps {}

const Header: React.SFC<HeaderProps> = props => {
  return (
    <Container>
      <h4>Jest view</h4>
    </Container>
  );
};

export default Header;
