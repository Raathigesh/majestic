import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Summary {
  @Field({ nullable: true })
  numPassedTests: number = 0;

  @Field({ nullable: true })
  numFailedTests: number = 0;

  @Field({ nullable: true })
  numPassedTestSuites: number = 0;

  @Field({ nullable: true })
  numFailedTestSuites: number = 0;

  @Field(returns => [String])
  failedTests: string[] = [];

  @Field(returns => [String])
  executingTests: string[] = [];
}
