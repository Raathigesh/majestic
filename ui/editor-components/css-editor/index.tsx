import React, { Component } from "react";
import styled from "react-emotion";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import PropertiesPanel from "./properties-panel";
import GET_CSS_PROPERTIES from "./fetch-css-properties.gql";
import UPDATE_CSS_PROPERTIES from "./update-css-variable.gql";
import ComponentFile from "../../../types/component-file/type";
import StyleDeclaration from "../../../types/style-declaration/type";
import { Icon } from "antd";

const Container = styled("div")`
  background-color: #09141c;
  padding: 10px;
  width: 350px;
  height: 100%;
`;

const Loading = styled("div")``;

interface CSSVariable {
  styleName: string;
  name: string;
  value: any;
  fieldType: string;
}

interface Props {
  activeNodePath: string | null;
  activeComponent: string | null;
  data: any;
  mutate: any;
}

const COMMENTS_SUBSCRIPTION = gql`
  subscription {
    changeToFile {
      path
      styledComponents {
        name
        declarations {
          name
          type
          value
        }
      }
    }
  }
`;

class CSSEditor extends Component<Props> {
  state = {};
  getPropertiesPanel = (data: { getStyledComponents: ComponentFile }) => {
    const styledComponent = data.getStyledComponents.styledComponents.find(
      component => component.name === this.props.activeComponent
    );

    if (!styledComponent) {
      return [];
    }

    return styledComponent.declarations;
  };

  render() {
    if (!this.props.activeNodePath) {
      return <Container />;
    }

    return (
      <Container>
        <Query
          query={GET_CSS_PROPERTIES}
          variables={{ filePath: this.props.activeNodePath }}
        >
          {({ loading, error, data: initialData, subscribeToMore }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;

            subscribeToMore({
              document: COMMENTS_SUBSCRIPTION,
              variables: { filePath: this.props.activeNodePath },
              updateQuery: (prev, { subscriptionData }) => {
                console.log("subs", subscriptionData);
                if (!subscriptionData.data) return prev;

                return {
                  getStyledComponents: {
                    ...subscriptionData.data.changeToFile
                  }
                };
              }
            });

            return (
              <Mutation mutation={UPDATE_CSS_PROPERTIES}>
                {(updateCSSVariable, { data: updatedData, loading }) => {
                  return (
                    <div>
                      <PropertiesPanel
                        properties={this.getPropertiesPanel(initialData)}
                        onChange={async (name: string, value: string) => {
                          await updateCSSVariable({
                            variables: {
                              declarationName: this.props.activeComponent,
                              filePath: this.props.activeNodePath,
                              propertyName: name,
                              propertyValue: value
                            }
                          });
                        }}
                      />
                    </div>
                  );
                }}
              </Mutation>
            );
          }}
        </Query>
      </Container>
    );
  }
}

export default CSSEditor;
