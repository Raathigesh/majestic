import React, { Component } from "react";
import styled from "react-emotion";
import ColorValue from "../components/color-value";
import TextValue from "../components/input";
import DarkButton from "../components/dark-button";
import { Radio } from "antd";
import { Flex } from "reflexbox";

const Container = styled("div")`
  display: flex;
  flex-direction: column;
`;

const Field = styled("div")`
  display: flex;
  color: white;
  min-width: 150px;
  padding-right: 5px;
  font-size: 13px;
`;

const Dotted = styled("div")`
  width: 10px;
  padding-top: 10px;
  border-bottom: 2px dotted;
`;

const Solid = styled("div")`
  width: 10px;
  padding-top: 10px;
  border-bottom: 2px solid;
`;

const Dashed = styled("div")`
  width: 10px;
  padding-top: 10px;
  border-bottom: 2px dashed;
`;

interface BorderSide {
  color: string;
  width: number;
  style: "dotted" | "dashed" | "solid";
}

type CurrentSelection = "top" | "left" | "bottom" | "right";

interface State {
  currentSelection: CurrentSelection;
  top?: BorderSide;
  right?: BorderSide;
  bottom?: BorderSide;
  left?: BorderSide;
}

interface Props {
  properties: { [key: string]: string };
  onChange: (property: string, value: string) => void;
}

export default class Border extends Component<Props, State> {
  state = {
    currentSelection: "top" as CurrentSelection
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const properties = nextProps.properties;

    return {
      currentSelection: prevState.currentSelection,
      top: {
        color: properties["border-top-color"],
        width: properties["border-top-width"],
        style: properties["border-top-style"]
      },
      right: {
        color: properties["border-right-color"],
        width: properties["border-right-width"],
        style: properties["border-right-style"]
      },
      bottom: {
        color: properties["border-bottom-color"],
        width: properties["border-bottom-width"],
        style: properties["border-bottom-style"]
      },
      left: {
        color: properties["border-left-color"],
        width: properties["border-left-width"],
        style: properties["border-left-style"]
      }
    };
  }

  handleBorderSideSelection = e => {
    this.setState({
      currentSelection: e.target.value
    });
  };

  handleBorderValueChange = (property: any, value: any) => {
    this.setState({
      [this.state.currentSelection as any]: {
        ...this.state[this.state.currentSelection],
        [property]: value
      }
    });

    this.props.onChange(
      `border-${this.state.currentSelection}-${property}`,
      value
    );
  };

  getCurrentBorderSide = () => {
    return this.state[this.state.currentSelection] || {};
  };

  render() {
    return (
      <Container>
        <Flex pb={1}>
          <Field>Border</Field>
          <Field>
            <Radio.Group
              size="small"
              value={this.state.currentSelection}
              onChange={this.handleBorderSideSelection}
            >
              <Radio.Button value="top">T</Radio.Button>
              <Radio.Button value="left">L</Radio.Button>
              <Radio.Button value="bottom">B</Radio.Button>
              <Radio.Button value="right">R</Radio.Button>
            </Radio.Group>
          </Field>
        </Flex>
        <Flex pl={2} column>
          <Flex pb={1}>
            <Field>Color</Field>
            <Field>
              <ColorValue
                color={this.getCurrentBorderSide().color}
                onChange={(color: string) => {
                  this.handleBorderValueChange("color", color);
                }}
              />
            </Field>
          </Flex>
          <Flex pb={1}>
            <Field>Width</Field>
            <Field>
              <TextValue
                size="small"
                value={this.getCurrentBorderSide().width}
                onChange={e => {
                  this.handleBorderValueChange("width", `${e.target.value}px`);
                }}
              />
            </Field>
          </Flex>
          <Flex pb={1}>
            <Field>Pattern</Field>
            <Field>
              <Radio.Group
                size="small"
                value={this.getCurrentBorderSide().style}
                onChange={e => {
                  this.handleBorderValueChange("style", e.target.value);
                }}
              >
                <Radio.Button value="dotted">
                  <Dotted />
                </Radio.Button>
                <Radio.Button value="solid">
                  <Solid />
                </Radio.Button>
                <Radio.Button value="dashed">
                  <Dashed />
                </Radio.Button>
              </Radio.Group>
            </Field>
          </Flex>
        </Flex>
      </Container>
    );
  }
}
