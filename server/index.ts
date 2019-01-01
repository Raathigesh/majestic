import { GraphQLServer } from "graphql-yoga";
import "reflect-metadata";
import { getSchema } from "./api";
import handlerApi from "./services/result-handler-api";

getSchema().then((schema: any) => {
  const server = new GraphQLServer({ schema });
  handlerApi(server.express);

  server.start(
    {
      playground: "/debug"
    },
    () => console.log("Server is running on localhost:4000")
  );
});
