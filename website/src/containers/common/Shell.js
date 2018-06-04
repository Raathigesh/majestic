import React from "react";
import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";

const Container = styled.div`
  background-color: #ececfd;
  min-height: 100vh;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 140px;
  padding-right: 140px;
`;

export default function Shell({ children }) {
  return (
    <Container>
      <Content>
        <Header />
        {children}
      </Content>
      <Footer />
    </Container>
  );
}
