import { ObjectType, Field } from "type-graphql";
import { TestItem } from "./test-item";

@ObjectType()
export class TestFile {
  @Field(returns => [TestItem])
  items: TestItem[];
}
