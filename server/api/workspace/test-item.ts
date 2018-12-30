import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class TestItem {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  type: "describe" | "it" | "test";

  @Field({ nullable: true })
  parent?: string;
}
