import { ObjectType, Field } from "type-graphql";
import { CoverageSummary } from "./coverage";

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
  passingTests: string[] = [];

  @Field(returns => [String])
  failedTests: string[] = [];

  @Field(returns => [String])
  executingTests: string[] = [];

  @Field(returns => CoverageSummary, { nullable: true })
  coverage: CoverageSummary;

  @Field(returns => Boolean, { nullable: true })
  haveCoverageReport: boolean;
}
