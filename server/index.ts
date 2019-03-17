import { GraphQLServer } from "graphql-yoga";
import "reflect-metadata";
import { getSchema } from "./api";
import resultHandlerApi from "./services/result-handler-api";
import getPort from "get-port";
import * as parseArgs from "minimist";
import * as chromeLauncher from "chrome-launcher";
import * as opn from "opn";
import { initializeStaticRoutes } from "./static-files";

const args = parseArgs(process.argv);
const defaultPort = args.port || 4000;
process.env.DEBUG_LOG = args.log || false;

if (args.root) {
  process.env.ROOT = args.root;
}

async function main() {
  const schema: any = await getSchema();
  const server = new GraphQLServer({ schema });
  initializeStaticRoutes(server.express);
  resultHandlerApi(server.express);

  const port = await getPort({ port: defaultPort });
  // this will be used by the jest reporter
  process.env.MAJESTIC_PORT = port.toString();

  async function ServerStartCallback() {
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

  server.start(
    {
      port,
      playground: "/debug"
    },
    ServerStartCallback
  );
}

main();
