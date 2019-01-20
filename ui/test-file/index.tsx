import React, { useEffect } from "react";
import styled from "styled-components";
import {} from "styled-system";
import { Button } from "@smooth-ui/core-sc";
import { useQuery, useMutation } from "react-apollo-hooks";
import FILEITEMS from "./file-items-subscription.gql";
import RUNFILE from "./run-file.gql";
import Test from "./test-item";
import { transform } from "./tranformer";
import useResult from "./result";
import useSubscription from "./use-subscription";

const Container = styled.div``;

interface Props {
  selectedFilePath: string;
}

export default function TestFile({ selectedFilePath }: Props) {
  const { data: fileItemResult } = useSubscription(FILEITEMS, {
    path: selectedFilePath
  });
  const toggleLike = useMutation(RUNFILE, {
    variables: {
      path: selectedFilePath
    }
  });

  const { result, Elements } = useResult(selectedFilePath);
  const root =
    fileItemResult &&
    fileItemResult.fileChange &&
    fileItemResult.fileChange.items[0];
  const tree =
    (fileItemResult &&
      fileItemResult.fileChange &&
      transform(root, fileItemResult.fileChange.items as any)) ||
    {};

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
      {fileItemResult && <Test item={tree} result={result} />}
    </Container>
  );
}
