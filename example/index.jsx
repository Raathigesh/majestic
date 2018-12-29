import React from "react";
import ReactDom from "react-dom";
import styled from "react-emotion";
import { hot } from "react-hot-loader";
import App from "./app.jsx";

const HotApp = hot(module)(App);
ReactDom.render(<HotApp />, document.getElementById("root"));
