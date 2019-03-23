import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class ConsoleLog {
  @Field({ nullable: true })
  message: string;

  @Field({ nullable: true })
  origin: string;

  @Field({ nullable: true })
  type: string;
}
