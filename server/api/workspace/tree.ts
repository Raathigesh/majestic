import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class Item {
  @Field()
  path: string;

  @Field()
  name: string;

  @Field()
  type: "directory" | "file";

  @Field({ nullable: true })
  parent?: string;
}
