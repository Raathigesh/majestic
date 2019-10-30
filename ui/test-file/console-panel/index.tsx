import React from "react";
import styled from "styled-components";
import { ObjectInspector, chromeDark } from "react-inspector";
import { ConsoleLog } from "../../../server/api/workspace/test-result/console-log";
import { AlertCircle, XCircle, MessageSquare } from "react-feather";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #404148;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const Header = styled.div`
  font-size: 11px;
  color: white;
  margin-bottom: 5px;
`;

const Content = styled.pre`
  display: flex;
  margin-bottom: 3px;
  font-size: 12px;
  border-radius: 3px;
  padding: 4px;
  font-family: monospace;
`;

const Logs = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 300px;
  overflow: auto;
`;

const IconWrapper = styled.div`
  margin-right: 5px;
  margin-top: 1px;
`;

function getIcon(type: String) {
  let icon = null;
  switch (type) {
    case "warn":
      icon = <AlertCircle size={11} color="#FDC055" />;
      break;
    case "error":
      icon = <XCircle size={11} color="#ff4f56" />;
      break;
    case "log":
      icon = <MessageSquare size={11} color="#19E28D" />;
      break;
  }

  return <IconWrapper>{icon}</IconWrapper>;
}

interface Props {
  consoleLogs: ConsoleLog[];
}

export default function ConsolePanel({ consoleLogs }: Props) {
  return (
    <Container>
      <Header>Console logs from the file</Header>
      <Logs>
        {consoleLogs.map((log, index) => {
          let result = log.message;
          try {
            result = eval("(" + log.message + ")");
          } catch (e) {
            console.log(e);
          }

          if (typeof result === "string") {
            return (
              <Content key={index}>
                {getIcon(log.type)}
                {result}
              </Content>
            );
          }

          return (
            <Content>
              {getIcon(log.type)}
              <ObjectInspector
                data={result}
                theme={{
                  ...chromeDark,
                  ...{
                    TREENODE_FONT_SIZE: "12px",
                    BASE_BACKGROUND_COLOR: "#404148",
                    ARROW_FONT_SIZE: 10
                  }
                }}
              />
            </Content>
          );
        })}
      </Logs>
    </Container>
  );
}
