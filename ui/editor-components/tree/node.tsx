import React, { Component } from "react";
import styled from "react-emotion";
import { Package, Edit3, Code, Aperture, Plus } from "react-feather";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";
import { Button, Tag } from "antd";

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  color: white;
  padding-left: 8px;
  padding-top: 2px;
  padding-bottom: 2px;
  cursor: pointer;
`;

const LabelContainer = styled("div")`
  display: flex;
  height: 20px;
  flex-direction: row;
  align-items: center;
  color: ${props => (props.hover ? "wheat" : "white")};
`;

const Label = styled("span")`
  padding-left: 5px;
  margin-right: 5px;
`;

interface Node {
  id: string;
  label: string;
  type: string;
  children: Node[];
}

interface Props {
  root: Node;
  highlightComponent: (id: string) => void;
}

interface State {
  hover: boolean;
}

function getNodeIcon(
  type: "Native" | "Composite" | "Text" | "Wrapper" | "StyledComponent"
) {
  switch (type) {
    case "Native":
      return <Code size={12} />;
    case "Composite":
      return <Package size={12} />;
    case "Text":
      return <Edit3 size={12} />;
    case "Wrapper":
      return <Package size={12} />;
    case "StyledComponent":
      return <Aperture size={12} />;
    default:
      return <Package size={12} />;
  }
}

export default class TreeNode extends Component<Props, State> {
  state = {
    hover: false
  };

  handleHover = () => {
    this.setState({
      hover: true
    });
    this.props.highlightComponent(this.props.root.id);
  };

  handleMouseOut = () => {
    this.setState({
      hover: false
    });
    this.props.highlightComponent(null);
  };

  render() {
    const { label, children, type } = this.props.root;
    return (
      <Container>
        <LabelContainer
          hover={this.state.hover}
          onMouseOver={this.handleHover}
          onMouseLeave={this.handleMouseOut}
        >
          <Tooltip title={type} position="right">
            {getNodeIcon(type)}
          </Tooltip>
          <Label>{label}</Label>
          {this.state.hover && (
            <Tooltip title="Create child component" position="right">
              <Tag>+</Tag>
            </Tooltip>
          )}
        </LabelContainer>
        {children.map(child => (
          <TreeNode
            root={child}
            highlightComponent={this.props.highlightComponent}
          />
        ))}
      </Container>
    );
  }
}
