import React from "react";
import { SiteData, Link, Head } from "react-static";
import styled from "styled-components";

import logoImg from "../logo.png";

import Flash from "./home/flash";
import Feature from "./home/feature";
import Shell from "./common/Shell";

export default () => (
  <SiteData
    render={({ repo, repoURL, repoName }) => (
      <Shell>
        <Flash />
        <Feature
          header="A UI driven developer experience for Jest"
          desc="Run a single test, a particular file or all of them with a click of a button"
          logo={require("../assets/feature1.png")}
        />
        <Feature
          header="Selective snapshot update"
          desc="Choose which shapshots to update"
          logo={require("../assets/feature2.png")}
        />
        <Feature
          header="Debugging made simple"
          desc="Debug your tests with node --inspect or with VS Code.
A closer look into your tests is just a click away."
          logo={require("../assets/feature3.png")}
        />
        <Feature
          header="Enhanced logging"
          desc="Debug your tests with node --inspect or with VS Code.  A closer look into your tests is just a click away."
          logo={require("../assets/feature4.png")}
        />
      </Shell>
    )}
  />
);
