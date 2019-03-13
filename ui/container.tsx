import React, { Component, Suspense } from "react";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import { ApolloProvider } from "react-apollo";
import { ThemeProvider } from "styled-components";
import client from "./apollo-client";
import App from "./app";
import theme from "./theme";
import { createGlobalStyle } from "styled-components";
import splitPanelCSS from "./split-panel-style";
import "typeface-open-sans";

const GlobalStyle = createGlobalStyle`
 body { font-family: 'Open sans'; font-size: 13px; margin: 0px;}
 ${splitPanelCSS}
`;

export default class Container extends Component {
  render() {
    return (
      <React.Fragment>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <ApolloHooksProvider client={client}>
            <ApolloProvider client={client}>
              <Suspense fallback={<div>Loading...</div>}>
                <App />
              </Suspense>
            </ApolloProvider>
          </ApolloHooksProvider>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}
