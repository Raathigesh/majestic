import React, { useEffect, useRef, useState } from "react";
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

const Container = styled.div<any>`
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
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  ${color};
`;

const ItemContainer = styled.div`
  display: flex;
  padding: 5px;
  cursor: pointer;
  color: #fefefe;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 1px;
  min-height: 20px;

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
  border: none;
  width: 99%;
  margin-bottom: 15px;
  padding: 5px;
  font-size: 13px;
  border-radius: 2px;

  &:focus {
    outline: none;
  }
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
  const onlyFiles = files.filter(file => file.type === "file");

  const [query, setQuery] = useState("");
  const searchBoxRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (searchBoxRef && searchBoxRef.current) {
      searchBoxRef.current.focus();
    }
  }, [show]);

  if (!show) return null;

  return (
    <React.Fragment>
      <Drop onClick={onClose} />
      <Container bg="dark">
        <SearchBox
          ref={searchBoxRef}
          value={query}
          placeholder="Start searching…"
          onChange={(event: any) => {
            setQuery(event.target.value);
          }}
        />
        <ResultContainer>
          {onlyFiles
            .filter(file =>
              file.path.toLowerCase().includes(query.toLowerCase())
            )
            .map((file: any, index: number) => (
              <ItemContainer
                key={index}
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
