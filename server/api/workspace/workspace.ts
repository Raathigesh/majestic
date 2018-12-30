import { ObjectType, Field, ID } from "type-graphql";
import { Item } from "./tree";

@ObjectType()
export class Workspace {
  @Field()
  projectRoot: string;

  @Field()
  name: string;

  @Field(type => [Item])
  files: Item[];
}
