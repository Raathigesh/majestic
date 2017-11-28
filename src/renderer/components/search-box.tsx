import * as React from "react";

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

const SearchBox: React.SFC<SearchBoxProps> = ({ onSearch }) => {
  return (
    <div className="pt-input-group .modifier">
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
    </div>
  );
};

export default SearchBox;
