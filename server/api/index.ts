import { buildSchema } from "type-graphql";
import { pubsub } from "../event-emitter";
import Scaffolder from "./scaffolder";

export async function getSchema() {
  return await buildSchema({
    resolvers: [Scaffolder],
    pubSub: pubsub as any
  });
}
