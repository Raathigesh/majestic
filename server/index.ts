import { GraphQLServer } from "graphql-yoga";
import { resolve } from "path";
import "reflect-metadata";
import { getSchema } from "./api";

getSchema().then((schema: any) => {
  const server = new GraphQLServer({ schema });

  server.start(
    {
      playground: "/debug"
    },
    () => console.log("Server is running on localhost:4000")
  );
});
