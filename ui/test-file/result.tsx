import React, { useState } from "react";
import { Subscription } from "react-apollo";
import FILERESULT from "./subscription.gql";
import { TestFileResult } from "../../server/api/workspace/test-result/file-result";

export type Result = { changeToResult: TestFileResult } | null;

export default function Result() {
  const [result, setData] = useState<Result>(null);
  const Elements = (
    <Subscription
      subscription={FILERESULT}
      variables={{
        path:
          "D:\\projects\\jest-runner\\create-react-app-integratio\\src\\App.test.js"
      }}
    >
      {({ data }) => {
        if (data !== result) {
          setData(data);
        }
        return "";
      }}
    </Subscription>
  );

  return {
    result: result ? result.changeToResult : null,
    Elements
  };
}
