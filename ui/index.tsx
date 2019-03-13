import React from "react";
import ReactDOM from "react-dom";
import "@babel/polyfill";
import Container from "./container";
import "react-tippy/dist/tippy.css";

ReactDOM.render(<Container />, document.getElementById("root"));

if ((module as any).hot) {
  (module as any).hot.accept("./container", () => {
    const NextApp = require("./container").default;
    ReactDOM.render(<Container />, document.getElementById("root"));
  });
}
