import React, { useState } from "react";
import styled from "styled-components";
import { Item } from "../../server/api/workspace/tree";
import { color } from "styled-system";

const Drop = styled.div`
  position: absolute;
  background-color: #444444;
  opacity: 0.7;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0px;
  z-index: 1;
`;

const Container = styled.div`
  width: 700px;
  max-height: 500px;
  position: absolute;
  z-index: 1;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  top: 150px;
  padding: 20px;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  ${color};
`;

const ItemContainer = styled.div`
  display: flex;
  padding-top: 10px;
  padding-bottom: 25px;
  padding-left: 5px;
  cursor: pointer;
  color: #fefefe;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: #404148;
  }
`;

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const SearchBox = styled.input`
  padding: 5px;
  height: 15px;
  border: 0px;
  width: 99%;
  margin-bottom: 15px;
`;

interface Props {
  projectRoot: string;
  show: boolean;
  files: Item[];
  onItemClick: (path: string) => void;
  onClose: () => void;
}

export function Search({
  projectRoot,
  files,
  show,
  onItemClick,
  onClose
}: Props) {
  const [query, setQuery] = useState("");

  if (!show) return null;

  return (
    <React.Fragment>
      <Drop onClick={onClose} />
      <Container bg="dark">
        <SearchBox
          value={query}
          placeholder="Start searching..."
          onChange={(event: any) => {
            setQuery(event.target.value);
          }}
        />
        <ResultContainer>
          {files
            .filter(file => file.type === "file")
            .filter(file =>
              file.path.toLowerCase().includes(query.toLowerCase())
            )
            .map(file => (
              <ItemContainer
                onClick={() => {
                  onItemClick(file.path);
                }}
              >
                {file.path.toLowerCase().replace(projectRoot.toLowerCase(), "")}
              </ItemContainer>
            ))}
        </ResultContainer>
      </Container>
    </React.Fragment>
  );
}
