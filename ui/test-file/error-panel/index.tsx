import React from "react";
import styled from "styled-components";
import * as Convert from "ansi-to-html";

const convert = new Convert({
  colors: {
    1: "#FF4F56",
    2: "#19E28D"
  }
});

const Container = styled.div`
  padding: 10px;
  background-color: #404148;
  border-radius: 5px;
  margin-bottom: 10px;
`;

interface Props {
  failureMessage: string;
}

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function ErrorPanel({ failureMessage }: Props) {
  if (!failureMessage || failureMessage.trim() === "") {
    return null;
  }

  return (
    <Container>
      <pre
        dangerouslySetInnerHTML={{
          __html: convert.toHtml(escapeHtml(failureMessage))
        }}
      />
    </Container>
  );
}
