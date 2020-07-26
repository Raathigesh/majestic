import { ObjectType, Field } from "type-graphql";
import { TestItemResult } from "./test-item-result";
import { ConsoleLog } from "./console-log";

@ObjectType()
export class TestFileResult {
  @Field({ nullable: true })
  path: string;

  @Field({ nullable: true })
  numFailingTests: number = 0;

  @Field({ nullable: true })
  numPassingTests: number = 0;

  @Field({ nullable: true })
  numPendingTests: number = 0;

  @Field({ nullable: true })
  failureMessage: string;

  @Field(returns => TestItemResult, { nullable: true })
  testResults: TestItemResult[] | null;

  @Field(returns => ConsoleLog, { nullable: true })
  consoleLogs: ConsoleLog[];
}
