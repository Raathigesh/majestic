import * as React from "react";
import styled from "styled-components";
import Sidebar from "./components/sidebar";
import Content from "./components/content";
import PreferenceModal from "./components/preference";
import DevTools from "mobx-react-devtools";

const ContainerDiv = styled.div`
  display: flex;
`;

export default function Container({ updater, workspace }) {
  return (
    <ContainerDiv>
      <DevTools />
      <Sidebar updater={updater} workspace={workspace} />
      <Content workspace={workspace} preference={workspace.preference} />
      <PreferenceModal preference={workspace.preference} />
    </ContainerDiv>
  );
}
