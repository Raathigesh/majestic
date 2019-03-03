import React from "react";
import styled from "styled-components";
import { space } from "styled-system";
import { useSpring, animated } from "react-spring";
import { Button } from "@smooth-ui/core-sc";
import { Play } from "react-feather";
import { Summary } from "../../../server/api/workspace/summary";

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
  font-size: 13px;
  color: #dcdbdb;
`;

const Value = styled.div`
  font-size: 20px;
`;

interface Props {
  summary: Summary;
}

export default function SummaryPanel({ summary }: Props) {
  const props = useSpring({
    number: summary.numPassedTests | 0,
    from: { number: 0 }
  });
  console.log(props.number);
  return (
    <Container mt={3} mb={3}>
      <Row>
        <Cell>
          <Value>0</Value>
          <Label>Passing suits</Label>
        </Cell>
        <Cell>
          <Value>0</Value>
          <Label>Failing suits</Label>
        </Cell>
      </Row>
      <Row>
        <Cell>
          <Value>
            <animated.span>
              {props.number.interpolate(value => value.toFixed())}
            </animated.span>
          </Value>
          <Label>Passing tests</Label>
        </Cell>
        <Cell>
          <Value>{summary.numFailedTests | 0}</Value>
          <Label>Failing tests</Label>
        </Cell>
      </Row>
    </Container>
  );
}
