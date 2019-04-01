import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class CoverageSummary {
  @Field({ nullable: true })
  statement: number = 0;

  @Field({ nullable: true })
  function: number = 0;

  @Field({ nullable: true })
  branch: number = 0;

  @Field({ nullable: true })
  line: number = 0;
}
