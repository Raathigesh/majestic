import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class RunnerStatus {
  @Field()
  running: boolean;

  @Field()
  activeFile: string;
}
