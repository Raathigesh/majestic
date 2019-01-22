import React, { useState, useEffect } from "react";
import { DocumentNode } from "graphql";
import { useApolloClient } from "react-apollo-hooks";

export default function useSubscription(
  query: DocumentNode,
  subscriptionQuery: DocumentNode,
  variables: any,
  queryResultMapper: (result: any) => any,
  subResultMapper: (result: any) => any
) {
  const client = useApolloClient();
  const [result, setResult] = useState<any>({
    data: {},
    loading: false,
    error: null
  });
  console.log("variables", variables);
  useEffect(
    () => {
      if (client) {
        client
          .query({
            query,
            variables,
            fetchPolicy: "network-only"
          })
          .then(({ data, errors, loading }) => {
            console.log(data);
            setResult({
              data: queryResultMapper(data),
              error: errors,
              loading
            });
          });
      }
    },
    [variables.path]
  );

  useEffect(
    () => {
      let subscription: any;
      if (client) {
        subscription = client
          .subscribe({
            query: subscriptionQuery,
            variables
          })
          .subscribe({
            error: (error: any) => {
              setResult({ loading: false, data: result.data, error });
            },
            next: (nextResult: any) => {
              const newResult = {
                data: subResultMapper(nextResult.data),
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
