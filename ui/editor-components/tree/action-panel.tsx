import React, { Component } from "react";
import styled from "react-emotion";
import { Icon, Button, Popover, Radio, Input } from "antd";

const Container = styled("div")``;
const Content = styled("div")`
  display: flex;
  flex-direction: column;
`;

const content = (
  <Content>
    Which type component would you like to create?
    <Radio.Group defaultValue="c" buttonStyle="solid" size="small">
      <Radio.Button value="a">Functional Component</Radio.Button>
      <Radio.Button value="b">Class Component</Radio.Button>
      <Radio.Button value="c">Styled Div</Radio.Button>
    </Radio.Group>
    Give a name?
    <Input
      placeholder="Component name"
      prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
    />
    <Button type="dashed">Create</Button>
  </Content>
);

export default class ActionPanel extends Component {
  render() {
    return (
      <Container>
        <Popover
          placement="rightTop"
          title={"Add Component"}
          content={content}
          trigger="click"
        >
          <Button type="dashed" icon="plus-square" size="small" ghost>
            Add component
          </Button>
        </Popover>
      </Container>
    );
  }
}
