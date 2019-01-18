import React, { Component, Suspense } from "react";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import { ApolloProvider } from "react-apollo";
import client from "./apollo-client";
import App from "./app";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
 body { font-family: 'Inter UI var alt', sans-serif; font-size: 13px; margin: 0px;}
`;

export default class Container extends Component {
  render() {
    return (
      <React.Fragment>
        <GlobalStyle />
        <ApolloHooksProvider client={client}>
          <ApolloProvider client={client}>
            <Suspense fallback={<div>Loading...</div>}>
              <App />
            </Suspense>
          </ApolloProvider>
        </ApolloHooksProvider>
      </React.Fragment>
    );
  }
}
