import React from "react";
import { SiteData, RouteData, Head } from "react-static";
import styled from "styled-components";

//

import Markdown from "components/Markdown";
import DocNavigation from "components/DocNavigation";
import Shell from "./common/Shell";

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const DocContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-right: 25px;
  background: white;
  padding: 15px;
  border-radius: 5px;
  margin-right: 18px;
`;

const Doc = () => (
  <SiteData
    render={({ repoName }) => (
      <RouteData
        render={({ editPath, markdown, title }) => (
          <Shell>
            <Container>
              <DocContent>
                <Markdown source={markdown} />
                <div>
                  <a href={editPath}>Edit this page on Github</a>
                </div>
              </DocContent>
              <DocNavigation />
            </Container>
          </Shell>
        )}
      />
    )}
  />
);

export default Doc;
