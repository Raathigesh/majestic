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

interface Props {
  selectedFilePath: string;
}

export default function TestFile({ selectedFilePath }: Props) {
  const {
    data: { file }
  } = useQuery(FILEITEMS, {
    variables: {
      path: selectedFilePath
    }
  });

  if (!file) {
    return null;
  }

  const root = file.items[0];
  const tree = transform(root, file.items as any);
  const toggleLike = useMutation(RUNFILE, {
    variables: {
      path: selectedFilePath
    }
  });
  const { result, Elements } = useResult(selectedFilePath);
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
