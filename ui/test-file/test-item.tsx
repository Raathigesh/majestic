import React from "react";
import styled from "styled-components";
import {} from "styled-system";
import { TestFileItem } from "./tranformer";

const Container = styled.div`
  margin-left: 15px;
  padding: 4px;
`;

interface Props {
  item: TestFileItem;
}

export default function Test({ item }: Props) {
  return (
    <Container>
      {item.name}
      {item.children && item.children.map(child => <Test item={child} />)}
    </Container>
  );
}
