import { buildSchema } from "type-graphql";
import { pubsub } from "../event-emitter";
import Workspace from "./workspace/resolver";
import Runner from "./runner/resolver";
import App from "./app/resolver";
import EditorInfo from "./editor-info/resolver";

export async function getSchema() {
  return await buildSchema({
    resolvers: [Workspace, Runner, App, EditorInfo],
    pubSub: pubsub as any
  });
}
