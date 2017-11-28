import * as React from "react";
import * as ReactDom from "react-dom";
import styled, { ThemeProvider } from "styled-components";
import "@blueprintjs/core/dist/blueprint.css";
import { Provider } from "mobx-react";
import { observer } from "mobx-react";

import Workspace from "./stores/Workspace";
import Sidebar from "./components/sidebar";
import Content from "./components/content";
import PreferenceModal from "./components/preference";
import "./style.css";
import MainTheme from "./theme/Main";

const Container = styled.div`display: flex;`;

function App() {
  return (
    <Container>
      <Sidebar workspace={Workspace} preference={Workspace.preference} />
      <Content workspace={Workspace} preference={Workspace.preference} />
      <PreferenceModal preference={Workspace.preference} />
    </Container>
  );
}

ReactDom.render(
  <Provider workspace={Workspace} preference={Workspace.preference}>
    <ThemeProvider theme={MainTheme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById("app")
);
