import { Field, ObjectType } from "type-graphql";

export type TestItemType = "describe" | "it" | "todo";

@ObjectType()
export class TestItem {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    type: TestItemType;

    @Field({ nullable: true })
    parent?: string;

    @Field()
    only: boolean;
}
