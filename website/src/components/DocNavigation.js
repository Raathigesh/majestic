import React from "react";
import styled from "styled-components";
import { Link } from "react-static";

const Container = styled.div`
  min-width: 210px;
  background-color: #d0d0fb;
  padding: 5px;
  border-radius: 10px;
`;

const Item = styled.div`
  color: black;
  padding: 6px;
  font-size: 15px;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #fdbf07;
  }
`;

export default function DocNavigation() {
  return (
    <Container>
      <Link to="/docs/two-step-guide">
        <Item>Two step guide</Item>
      </Link>
      <Link to="/docs/run-as-an-app">
        <Item>Running as an app</Item>
      </Link>
      <Link to="/docs/debugging-in-vs-code">
        <Item>Debugging in VS Code</Item>
      </Link>
      <Link to="/docs/configuring-majestic">
        <Item>Additional Configuration</Item>
      </Link>
      <Link to="/docs/contributing">
        <Item>Contributing</Item>
      </Link>
    </Container>
  );
}
