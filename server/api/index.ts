import { buildSchema } from "type-graphql";
import { pubsub } from "../event-emitter";
import Workspace from "./Workspace/resolver";
import Runner from "./runner/resolver";

export async function getSchema() {
  return await buildSchema({
    resolvers: [Workspace, Runner],
    pubSub: pubsub as any
  });
}
