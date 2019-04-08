import { GraphQLServer } from "graphql-yoga";
import "reflect-metadata";
import { getSchema } from "./api";
import resultHandlerApi from "./services/result-handler-api";
import getPort from "get-port";
import * as parseArgs from "minimist";
import * as chromeLauncher from "chrome-launcher";
import * as opn from "open";
import "consola";
import { initializeStaticRoutes } from "./static-files";
import { root } from "./services/cli";
import * as readPkgUp from "read-pkg-up";

const pkg = readPkgUp.sync({
  cwd: __dirname
}).pkg;
declare var consola: any;

const args = parseArgs(process.argv);
const defaultPort = args.port || 4000;
process.env.DEBUG_LOG = args.debug ? "log" : "";

if (args.root) {
  process.env.ROOT = args.root;
}

if (args.version) {
  console.log(`v${pkg.version}`);
  process.exit();
}

async function main() {
  try {
    const schema: any = await getSchema();
    const server = new GraphQLServer({ schema });
    initializeStaticRoutes(server.express, root);
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
        console.log(`⚡  Majestic v${pkg.version} is running at ${url} `);

        if (args.app) {
          await chromeLauncher.launch({
            startingUrl: url,
            chromeFlags: [`--app=${url}`]
          });
        } else if (!args.noOpen) {
          opn(url);
        }
      }
    );
  } catch (e) {
    consola.error(e);
  }
}

main();
