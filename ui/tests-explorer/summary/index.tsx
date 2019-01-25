import React from "react";
import styled from "styled-components";
import { space } from "styled-system";
import { Button } from "@smooth-ui/core-sc";
import { Play } from "react-feather";

const Container = styled.div`
  ${space};
`;

const Row = styled.div`
  display: flex;
  font-size: 16px;
  margin-bottom: 5px;
`;

const Cell = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Label = styled.div`
  font-size: 11px;
`;

const Value = styled.div``;

export default function Summary() {
  return (
    <Container p={2}>
      <Button size="sm" onClick={() => {}}>
        <Play size={14} />
      </Button>
      <Row>
        <Cell>
          <Value>123</Value>
          <Label>Passing suits</Label>
        </Cell>
        <Cell>
          <Value>123</Value>
          <Label>Failing suits</Label>
        </Cell>
      </Row>
      <Row>
        <Cell>
          <Value>123</Value>
          <Label>Passing tests</Label>
        </Cell>
        <Cell>
          <Value>123</Value>
          <Label>Failing tests</Label>
        </Cell>
      </Row>
    </Container>
  );
}
