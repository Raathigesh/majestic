import * as React from "react";
import styled from "styled-components";

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

const Container = styled.div`
  margin-bottom: 10px;
`;

const SearchBox: React.SFC<SearchBoxProps> = ({ onSearch }) => {
  return (
    <Container className="pt-input-group">
      <span className="pt-icon pt-icon-search" />
      <input
        className="pt-input"
        type="search"
        placeholder="Search input"
        dir="auto"
        onChange={ev => {
          onSearch(ev.target.value);
        }}
      />
    </Container>
  );
};

export default SearchBox;
