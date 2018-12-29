import React from "react";
import styled from "styled-components";
import AdditionalComponent from "./AdditionalComponent.jsx";
const HelloDiv = styled("div")`
  background-color: #7ed321;
  color: white;
`;

const HelloInnerDiv = styled("div")`
  background-color: #bd4040;

  width: 505px;
  border: 5px;
  border-top-width: 70;
  border-left-width: 23;
  border-left-color: #417505;
  border-top-color: #e93535;
  border-top-style: dotted;
  border-left-style: solid;
`;
const Bar = styled("button")`
  background-color: #ce8080;
`;

const App = function Home() {
  return (
    <div>
      <HelloDiv>
        <div>
          <HelloInnerDiv>
            <Bar>Hello</Bar>
            <AdditionalComponent />
          </HelloInnerDiv>
        </div>
      </HelloDiv>
    </div>
  );
};

export default App;
