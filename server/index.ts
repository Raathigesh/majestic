import { GraphQLServer } from "graphql-yoga";
import * as express from "express";
import "reflect-metadata";
import { getSchema } from "./api";
import handlerApi from "./services/result-handler-api";

getSchema().then((schema: any) => {
  const server = new GraphQLServer({ schema });

  /*   server.express.get("/", (req, res) =>
    res.sendFile("./ui/index.html", {
      root: __dirname
    })
  );

  server.express.get("/ui.bundle.js", (req, res) =>
    res.sendFile("./ui/ui.bundle.js", {
      root: __dirname
    })
  ); */

  handlerApi(server.express);

  server.start(
    {
      playground: "/debug"
    },
    () => console.log("Server is running on localhost:4000")
  );
});
