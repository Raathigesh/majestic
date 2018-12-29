import React, { Component } from "react";
import { Input } from "antd";
import styled from "react-emotion";
import { Flex } from "reflexbox";
import DarkInput from "../components/input";

const Field = styled("div")`
  display: flex;
  color: white;
  min-width: 150px;
  padding-right: 5px;
  font-size: 13px;
`;

export default class BorderRadius extends Component {
  render() {
    return (
      <Flex pb={1}>
        <Field>Border Radius</Field>
        <Field>
          <Input.Group compact>
            <DarkInput
              style={{ width: "20%" }}
              size="small"
              placeholder="Top"
            />
            <DarkInput
              style={{ width: "20%" }}
              size="small"
              placeholder="Right"
            />
            <DarkInput
              style={{ width: "20%" }}
              size="small"
              placeholder="Bottom"
            />
            <DarkInput
              style={{ width: "20%" }}
              size="small"
              placeholder="Left"
            />
          </Input.Group>
        </Field>
      </Flex>
    );
  }
}
