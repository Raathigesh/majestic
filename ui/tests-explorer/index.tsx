import React from "react";
import styled from "styled-components";
import {} from "styled-system";
import FileItem from "./file-item";

const Container = styled.div``;

export default function TestExplorer() {
  return (
    <Container>
      <FileItem
        item={{
          name: "root",
          path: "",
          children: [
            {
              name: "index.js",
              path: ""
            }
          ]
        }}
      />
    </Container>
  );
}
