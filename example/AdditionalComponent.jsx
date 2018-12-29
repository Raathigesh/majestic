import React from "react";
import styled from "styled-components";
import Select from "react-select";
const Container = styled("div")`
  color: red;
  border-top-color: #f33333;
  border-top-width: 30px;
  border-top-style: dotted;
  border-left-color: #db5656;
`;

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" }
];

export default function AdditionalComponent() {
  return (
    <Container>
      <Select options={options} />
    </Container>
  );
}
