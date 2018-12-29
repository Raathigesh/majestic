import React, { Component } from "react";
import { SketchPicker } from "react-color";

interface State {
  displayColorPicker: boolean;
  color: string;
}

interface Props {
  color: string;
  onChange: (color: string) => void;
}

export default class ColorValue extends Component<Props, State> {
  state = { displayColorPicker: false, color: "" };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = (color: any) => {
    this.props.onChange(color.hex);
  };

  render() {
    return (
      <div>
        <div
          style={{
            padding: "1px",
            background: "#fff",
            borderRadius: "1px",
            boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
            display: "inline-block",
            cursor: "pointer"
          }}
          onClick={this.handleClick}
        >
          <div
            style={{
              width: "36px",
              height: "14px",
              borderRadius: "2px",
              background: this.props.color
            }}
          />
        </div>
        {this.state.displayColorPicker ? (
          <div
            style={{
              position: "absolute",
              zIndex: 2
            }}
          >
            <div
              style={{
                position: "fixed",
                top: "0px",
                right: "0px",
                bottom: "0px",
                left: "0px"
              }}
              onClick={this.handleClose}
            />
            <SketchPicker
              color={this.state.color}
              onChange={this.handleChange}
            />
          </div>
        ) : null}
      </div>
    );
  }
}
