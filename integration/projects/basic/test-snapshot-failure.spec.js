import renderer from "react-test-renderer";
import React from "react";
import App from "./app";

describe("test", () => {
  it("Snapsh0t test", () => { // Make sure we don't use 'snapshot' because it fools the snapshot button
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
