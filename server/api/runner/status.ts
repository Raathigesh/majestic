import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class RunnerStatus {
  @Field({ nullable: true })
  running: boolean;

  @Field({ nullable: true })
  activeFile: string;
}
