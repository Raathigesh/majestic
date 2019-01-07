import React from "react";
import styled from "styled-components";
import {} from "styled-system";
import { useQuery } from "react-apollo-hooks";
import FILEITEMS from "./query.gql";
import Test from "./test-item";
import { transform } from "./tranformer";

const Container = styled.div``;

export default function TestFile() {
  const {
    data: { file }
  } = useQuery(FILEITEMS, {
    variables: {
      path:
        "D:\\projects\\jest-runner\\create-react-app-integratio\\src\\App.test.js"
    }
  });

  const root = file.items[0];
  const tree = transform(root, file.items as any);

  return (
    <Container>
      <Test item={tree} />
    </Container>
  );
}
