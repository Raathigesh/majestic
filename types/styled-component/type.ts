import { ObjectType, Field } from "type-graphql";
import StyleDeclaration from "../style-declaration/type";

@ObjectType()
export default class StyledComponent {
  @Field()
  name: string;

  @Field(type => StyleDeclaration)
  declarations: StyleDeclaration[];
}
