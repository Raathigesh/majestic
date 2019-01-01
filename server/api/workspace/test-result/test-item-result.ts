import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class TestItemResult {
  @Field()
  title: string;

  @Field()
  numPassingAsserts: number;

  @Field()
  status: string;

  @Field(returns => [String])
  failureMessages: string[] = [];

  @Field(returns => [String])
  ancestorTitles: string[] = [];

  @Field()
  duration: number;
}
