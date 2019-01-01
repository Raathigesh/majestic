import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class App {
  @Field()
  selectedFile: string;
}
