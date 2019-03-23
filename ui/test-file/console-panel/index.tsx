import React from "react";
import styled from "styled-components";
import ReactJson from "react-json-view";
import { ConsoleLog } from "../../../server/api/workspace/test-result/console-log";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #242326;
`;

const Header = styled.div`
  padding: 6px;
  padding-left: 20px;
  font-weight: 600;
  background-color: #262529;
  color: white;
`;

interface Props {
  consoleLogs: ConsoleLog[];
}

export default function ConsolePanel({ consoleLogs }: Props) {
  return (
    <Container>
      {consoleLogs.map(log => {
        let result = log.message;
        try {
          result = JSON.parse(log.message);
        } catch (e) {}

        if (typeof result === "string") {
          return <div>{result}</div>;
        }

        return <ReactJson src={result} theme="tomorrow" />;
      })}
    </Container>
  );
}
