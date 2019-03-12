import { GraphQLServer } from "graphql-yoga";
import "reflect-metadata";
import { getSchema } from "./api";
import handlerApi from "./services/result-handler-api";
import { resolve } from "path";
import getPort from "get-port";
import * as parseArgs from "minimist";
import * as chromeLauncher from "chrome-launcher";

getSchema().then((schema: any) => {
  const server = new GraphQLServer({ schema });

  server.express.get("/", (req, res) =>
    res.sendFile("./ui/index.html", {
      root: resolve(__dirname, "..")
    })
  );
  server.express.get("/ui.bundle.js", (req, res) =>
    res.sendFile("./ui/ui.bundle.js", {
      root: resolve(__dirname, "..")
    })
  );

  handlerApi(server.express);

  getPort({ port: 4000 }).then(port => {
    server.start(
      {
        port,
        playground: "/debug"
      },
      () => {
        console.log(`Server is running on localhost:${port}`);

        const args = parseArgs(process.argv);
        if (args.app) {
          chromeLauncher
            .launch({
              startingUrl: `http://localhost:${port}`,
              chromeFlags: [`--app=http://localhost:${port}`]
            })
            .then((chrome: any) => {
              console.log("Opening app");
            });
        }
      }
    );
  });
});
