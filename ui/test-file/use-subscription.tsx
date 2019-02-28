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

  let subscription: any;

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
      if (client) {
        if (subscription) {
          subscription.unsubscribe();
        }

        subscription = client
          .subscribe({
            query: subscriptionQuery,
            variables,
            fetchPolicy: "network-only"
          })
          .subscribe({
            error: (error: any) => {
              setResult({ loading: false, data: result.data, error });
            },
            next: (nextResult: any) => {
              console.log("Subs for", variables.path);
              const newResult = {
                data: subResultMapper(nextResult.data),
                error: undefined,
                loading: false
              };
              setResult(newResult);
            }
          });
      }
    },
    [variables.path]
  );

  useEffect(
    () => {
      return () => {
        subscription && subscription.unsubscribe();
      };
    },
    [variables.path]
  );

  return result;
}
