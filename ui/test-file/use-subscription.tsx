import React, { useState, useEffect } from "react";
import { DocumentNode } from "graphql";
import { useApolloClient } from "react-apollo-hooks";

export default function useSubscription(
  query: DocumentNode,
  subscriptionQuery: DocumentNode,
  variables: any,
  queryResultMapper: (result: any) => any,
  subResultMapper: (result: any) => any,
  name: string = ""
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
        setResult({
          ...result,
          loading: true
        });
        client
          .query({
            query,
            variables,
            fetchPolicy: "network-only"
          })
          .then(({ data, errors, loading }) => {
            console.log(name, data);
            setResult({
              data: queryResultMapper(data),
              error: errors,
              loading
            });
          });
      }
    },
    variables.path ? [variables.path] : []
  );

  useEffect(
    () => {
      if (client) {
        console.log("Subbed to", name);
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
              console.log("Sub Result", name, nextResult.data);
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
    variables.path ? [variables.path] : []
  );

  useEffect(
    () => {
      return () => {
        subscription && subscription.unsubscribe();
      };
    },
    variables.path ? [variables.path] : []
  );

  return result;
}
