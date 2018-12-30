import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class Runner {
  @Field()
  status: string;

  @Field()
  config: string;
}
