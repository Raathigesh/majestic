import { ObjectType, Field } from "type-graphql";

export type TestItemType = "describe" | "it" | "test";

@ObjectType()
export class TestItem {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  type: TestItemType;

  @Field({ nullable: true })
  parent?: string;
}
