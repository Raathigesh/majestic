import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  font-size: 45px;
  align-self: center;
  align-items: center;
`;

const Column = styled.div`
  flex-grow: 1;
`;

const Text = styled.div`
  margin-right: 20px;
`;

const Highlight = styled.span`
  background-color: #fdbf07;
`;

const Screen = styled.img`
  border-radius: 10px;
  box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.2);
`;

const Step = styled.div`
  display: flex;
  font-weight: 600;
  border-radius: 50%;
  margin-right: 10px;
  height: 20px;
  width: 20px;
  background-color: #26282a;
  color: #fdbf07;
  align-self: center;
  align-items: center;
  justify-content: center;
  font-size: 13px;
`;

const Instructions = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 19px;
  margin-top: 5px;
`;

const Syntax = styled.span`
  background-color: #26282a;
  color: #fdbf07;
  padding-right: 5px;
  padding-left: 5px;
  border-radius: 3px;
  margin-left: 2px;
  height: 27px;
`;

export default () => {
  return (
    <Container>
      <Column>
        <Text>
          <Highlight>Zero config</Highlight> UI for Jest
          <Instructions>
            <Step>1</Step>
            <div>
              Install majestic globally
              <Syntax>yarn global add majestic</Syntax>
            </div>
          </Instructions>
          <Instructions>
            <Step>2</Step>
            <div>
              Go to a Jest project directory and run <Syntax>majestic</Syntax>
            </div>
          </Instructions>
          <Instructions>
            <Step>3</Step>
            <div>
              Open <Syntax>http://localhost:3005</Syntax> in browser
            </div>
          </Instructions>
        </Text>
      </Column>
      <Column>
        <Screen src={require("../../assets/screen.png")} />
      </Column>
    </Container>
  );
};
