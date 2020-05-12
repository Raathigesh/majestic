import { ObjectType, Field, InterfaceType } from "type-graphql";
import { string } from "prop-types";

@ObjectType()
export class Editor {
  @Field({ nullable: true })
  id: string;
  @Field({ nullable: true })
  name: string;
  @Field({ nullable: true })
  binary: string;
  @Field({ nullable: true })
  isTerminalEditor: boolean;
  @Field(type => [String])
  paths: String[];
  @Field(type => [String])
  keywords: String[];
}

@ObjectType()
export class EditorInfo {
  @Field(type => Editor)
  defaultEditor: Editor;
  @Field(type => [Editor])
  allEditors: Editor[];
}

@ObjectType()
export class OpenInEditor {
  @Field(type => String)
  status: String;
  @Field(type => String)
  message: String;
}
