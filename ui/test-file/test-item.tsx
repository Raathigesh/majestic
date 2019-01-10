import React, { Fragment } from "react";
import styled from "styled-components";
import {} from "styled-system";
import { TestFileItem } from "./tranformer";
import useResult from "./result";

const Container = styled.div`
  margin-left: 15px;
  padding: 4px;
`;

interface Props {
  item: TestFileItem;
}

export default function Test({ item }: Props) {
  const { result, Elements } = useResult();
  console.log(result);
  return (
    <Fragment>
      {Elements}
      <Container>
        {item.name}
        {item.children && item.children.map(child => <Test item={child} />)}
      </Container>
    </Fragment>
  );
}
