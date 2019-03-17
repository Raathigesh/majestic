// #!/usr/bin/env node
import { GraphQLServer } from "graphql-yoga";
import "reflect-metadata";
import { getSchema } from "./api";
import handlerApi from "./services/result-handler-api";
import { resolve } from "path";
import getPort from "get-port";
import * as parseArgs from "minimist";
import * as chromeLauncher from "chrome-launcher";
import * as opn from "opn";
import Project from "./services/project";
import { root } from "./services/cli";
import ConfigResolver from "./services/config-resolver";

const args = parseArgs(process.argv);
const defaultPort = args.port || 4000;

if (args.root) {
  process.env.ROOT = args.root;
}

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
  server.express.get("/favicon.ico", (req, res) =>
    res.sendFile("./ui/favicon.ico", {
      root: resolve(__dirname, "..")
    })
  );

  handlerApi(server.express);

  getPort({ port: defaultPort }).then(port => {
    server.start(
      {
        port,
        playground: "/debug"
      },
      () => {
        process.env.MAJESTIC_PORT = port.toString();
        const url = `http://localhost:${port}`;
        console.log(`🍡  Majestic is running: ${url} `);

        const project = new Project(root);
        const configResolver = new ConfigResolver();
        const majesticConfig = configResolver.getConfig(project.projectRoot);
        const fileMap = project.readTestFiles(majesticConfig);

        console.log("Files: ", JSON.stringify(fileMap));

        if (args.app) {
          chromeLauncher
            .launch({
              startingUrl: url,
              chromeFlags: [`--app=${url}`]
            })
            .then((chrome: any) => {
              console.log("Opening app");
            });
        } else {
          opn(url);
        }
      }
    );
  });
});
