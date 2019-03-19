import { GraphQLServer } from "graphql-yoga";
import "reflect-metadata";
import { getSchema } from "./api";
import resultHandlerApi from "./services/result-handler-api";
import getPort from "get-port";
import * as parseArgs from "minimist";
import * as chromeLauncher from "chrome-launcher";
import * as opn from "opn";
import { initializeStaticRoutes } from "./static-files";
import {
  UnableToResolveConfig,
  CouldNotResolveJestPath
} from "./services/errors";

const args = parseArgs(process.argv);
const defaultPort = args.port || 4000;
process.env.DEBUG_LOG = args.debug ? "log" : "";

if (args.root) {
  process.env.ROOT = args.root;
}

async function main() {
  try {
    const schema: any = await getSchema();
    const server = new GraphQLServer({ schema });
    initializeStaticRoutes(server.express);
    resultHandlerApi(server.express);

    const port = await getPort({ port: defaultPort });
    // this will be used by the jest reporter
    process.env.MAJESTIC_PORT = port.toString();

    server.start(
      {
        port,
        playground: "/debug"
      },
      async () => {
        const url = `http://localhost:${port}`;
        console.log(`🍡  Majestic is running: ${url} `);

        if (args.app) {
          await chromeLauncher.launch({
            startingUrl: url,
            chromeFlags: [`--app=${url}`]
          });
          console.log("Opening app");
        } else {
          opn(url);
        }
      }
    );
  } catch (e) {
    if (e instanceof UnableToResolveConfig) {
      console.log(
        "🚨 Majestic support Jest 22 and above because it relies on the --showConfig CLI flag to obtain configuration. We couldn't obtain config successfully. Create an issue if you think this is a bug: https://github.com/Raathigesh/majestic/issues"
      );
    } else if (e instanceof CouldNotResolveJestPath) {
      console.log(
        "🚨 Majestic was unable to find Jest package in node modules folder. But you can provide the path manually. Please take a look at the documentation at https://github.com/Raathigesh/majestic."
      );
    }
  }
}

main();
