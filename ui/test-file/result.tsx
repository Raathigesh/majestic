import React, { useState } from "react";
import { Subscription } from "react-apollo";
import FILERESULT from "./subscription.gql";

export default function Result() {
  const [result, setData] = useState({});
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
    result,
    Elements
  };
}
