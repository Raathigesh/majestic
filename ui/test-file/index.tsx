import React, { useEffect } from "react";
import styled from "styled-components";
import { space, color } from "styled-system";
import { Button } from "@smooth-ui/core-sc";
import { useQuery, useMutation } from "react-apollo-hooks";
import FILEITEMS_SUB from "./file-items-subscription.gql";
import FILEITEMS from "./query.gql";
import RUNFILE from "./run-file.gql";
import FILERESULTSUB from "./subscription.gql";
import RESULT from "./result.gql";
import Test from "./test-item";
import { transform } from "./tranformer";
import useSubscription from "./use-subscription";

const Container = styled.div`
  ${space};
  ${color};
  flex-grow: 1;
  height: 100vh;
`;

interface Props {
  selectedFilePath: string;
}

export default function TestFile({ selectedFilePath }: Props) {
  const { data: fileItemResult } = useSubscription(
    FILEITEMS,
    FILEITEMS_SUB,
    {
      path: selectedFilePath
    },
    result => result.file,
    result => result.fileChange
  );
  console.log(fileItemResult);
  const toggleLike = useMutation(RUNFILE, {
    variables: {
      path: selectedFilePath
    }
  });

  const { data: result } = useSubscription(
    RESULT,
    FILERESULTSUB,
    {
      path: selectedFilePath
    },
    result => result.result,
    result => result.changeToResult
  );
  console.log("outer result", result);
  const root =
    fileItemResult && fileItemResult.items && fileItemResult.items[0];
  const tree =
    (fileItemResult &&
      fileItemResult.items &&
      transform(root, fileItemResult.items as any)) ||
    {};

  return (
    <Container p={2} bg="slightDark" color="text">
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
