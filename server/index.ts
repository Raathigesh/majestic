import { GraphQLServer } from "graphql-yoga";
import { resolve } from "path";
import "reflect-metadata";
import { Compiler } from "./server";
import { getSchema } from "./api";

getSchema().then((schema: any) => {
  const server = new GraphQLServer({ schema });
  const projectRoot = resolve("./example");
  const compiler = new Compiler(server.express, projectRoot);

  server.start(
    {
      playground: "/debug"
    },
    () => console.log("Server is running on localhost:4000")
  );
});
