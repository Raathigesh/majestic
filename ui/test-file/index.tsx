import React from "react";
import styled from "styled-components";
import {} from "styled-system";
import { Button } from "@smooth-ui/core-sc";
import { useQuery, useMutation } from "react-apollo-hooks";
import FILEITEMS from "./query.gql";
import RUNFILE from "./run-file.gql";
import Test from "./test-item";
import { transform } from "./tranformer";
import useResult from "./result";

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
  const toggleLike = useMutation(RUNFILE, {
    variables: {
      path:
        "D:\\projects\\jest-runner\\create-react-app-integratio\\src\\App.test.js"
    }
  });
  const { result, Elements } = useResult();
  return (
    <Container>
      {Elements}
      <Button
        size="sm"
        onClick={() => {
          toggleLike();
        }}
      >
        Run
      </Button>
      <Test item={tree} result={result} />
    </Container>
  );
}
