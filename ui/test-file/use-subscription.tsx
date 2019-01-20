import React, { useState, useEffect } from "react";
import { Subscription } from "react-apollo";
import { TestFileResult } from "../../server/api/workspace/test-result/file-result";
import { DocumentNode } from "graphql";
import { useApolloClient } from "react-apollo-hooks";

export default function useSubscription(query: DocumentNode, variables: any) {
  const client = useApolloClient();
  const [result, setResult] = useState<any>({
    data: {},
    loading: false,
    error: null
  });

  useEffect(
    () => {
      let subscription: any;
      if (client) {
        subscription = client
          .subscribe({
            query,
            variables
          })
          .subscribe({
            error: (error: any) => {
              setResult({ loading: false, data: result.data, error });
            },
            next: (nextResult: any) => {
              const newResult = {
                data: nextResult.data,
                error: undefined,
                loading: false
              };
              setResult(newResult);
            }
          });
      }

      return () => {
        subscription && subscription.unsubscribe();
      };
    },
    [variables]
  );

  return result;
}
