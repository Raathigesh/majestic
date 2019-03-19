import renderer from "react-test-renderer";
import React from "react";
import App from "./app";

describe("test", () => {
  it("snapshot test", () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
