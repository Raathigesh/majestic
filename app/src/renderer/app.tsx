import * as React from "react";
import * as ReactDom from "react-dom";
import { ThemeProvider } from "styled-components";
import "@blueprintjs/core/dist/blueprint.css";
import { Provider } from "mobx-react";

import Workspace from "./stores/Workspace";
import Updater from "./stores/Updater";
import Container from "./Container";
import "./style.css";
import MainTheme from "./theme/Main";

ReactDom.render(
  <Provider workspace={Workspace} preference={Workspace.preference}>
    <ThemeProvider theme={MainTheme}>
      <Container updater={Updater} workspace={Workspace} />
    </ThemeProvider>
  </Provider>,
  document.getElementById("app")
);
