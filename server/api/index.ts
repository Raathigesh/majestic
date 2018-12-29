import ComponentFileResolver from "./component-file/resolver";
import { buildSchema } from "type-graphql";
import { pubsub } from "../services/event-emitter";
import Scaffolder from "./scaffolder";

export async function getSchema() {
  return await buildSchema({
    resolvers: [ComponentFileResolver, Scaffolder],
    pubSub: pubsub as any
  });
}
