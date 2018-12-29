import { ObjectType, Field } from "type-graphql";
import StyledComponent from "../styled-component/type";

@ObjectType()
export default class ComponentFile {
  @Field()
  path: string;

  @Field(type => StyledComponent)
  styledComponents: StyledComponent[];
}
