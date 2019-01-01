import { buildSchema } from "type-graphql";
import { pubsub } from "../event-emitter";
import Workspace from "./workspace/resolver";
import Runner from "./runner/resolver";
import App from "./app/resolver";

export async function getSchema() {
  return await buildSchema({
    resolvers: [Workspace, Runner, App],
    pubSub: pubsub as any
  });
}
