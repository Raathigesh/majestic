import React, { Component } from "react";
import { ApolloProvider } from "react-apollo-hooks";
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
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </React.Fragment>
    );
  }
}
