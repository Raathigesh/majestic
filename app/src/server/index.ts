#!/usr/bin/env node
import * as express from 'express';
import * as http from 'http';
const cors = require('cors');
const fs = require('fs');
import { join } from 'path';
const chalk = require('chalk');
import { register } from '../core/portal/server';
import Engine from '../core/engine';
import getRemoteMethods from './remoteMethods';
import { getConnection } from './relay';
import { ConfigProvider } from '../core/engine/configProvider';
import { ItBlock } from '../core/engine/types/ItBlock';
import template from './template';
const chromeLauncher = require('chrome-launcher');
const parseArgs = require('minimist');
const ora = require('ora');
const opn = require('opn');
const getPort = require('get-port');
const args = parseArgs(process.argv);
const initialPort = 3005;

export default function(
  rootDirectory: string = '',
  autoLaunch: boolean = true
) {
  return getPort({ port: initialPort }).then((port: number) => {
    (process.env as any).serverPort = port;

    const app = express();

    if (!args.dev) {
      app.get('/', (req: any, res: any) => {
        res.type('text/html');
        const content = fs.readFileSync(
          join(__dirname, '../../build/index.html'),
          'utf8'
        );
        const replacedStreing = content.replace(
          'serverPort: 3005',
          template(port)
        );
        res.send(replacedStreing);
      });
    }
    app.use(cors());
    app.options('*', cors());
    app.use(express.static(join(__dirname, '../../build')));

    const server = http.createServer(app);
    const projectPath = rootDirectory || args.project || process.cwd();
    const configProvider = new ConfigProvider(projectPath);
    const engine = new Engine(projectPath, configProvider.getConfig(), {
      serverPort: port
    });

    const spinner = ora('Reading tests').start();
    engine.testFiles.read(engine.root);
    spinner.stop();

    getConnection(server);

    const serverApp = server.listen(port, (err: any) => {
      if (err) {
        console.log(err);
      }

      engine.getVersion().then((version: string) => {
        console.log(
          `${chalk.black.bgYellow.bold(`Majestic v${version}`)}\n${chalk.white(
            'Zero config UI for Jest'
          )}`
        );

        if (args.app) {
          chromeLauncher
            .launch({
              startingUrl: `http://localhost:${port}`,
              chromeFlags: [`--app=http://localhost:${port}`]
            })
            .then((chrome: any) => {
              console.log('Opening app');
            });
        } else {
          if (!args.dev && autoLaunch) {
            opn(`http://localhost:${port}`);
          }

          console.log(`visit ${chalk.green(`http://localhost:${port}`)}`);
        }
      });
      register('ui', getRemoteMethods(engine), (remote: any) => {
        engine.watcher.handlers(
          (path: string) => {
            remote.onFileAdd(path, engine.testFiles.read(engine.root));
          },
          (path: string) => {
            remote.onFileDelete(path);
          },
          (path: string, itBlocks?: ItBlock[]) => {
            if (itBlocks) {
              remote.onFileChange(path, itBlocks);
            }
          }
        );

        engine.testRunner.registerOnDebuggerExit(() => {
          remote.onDebuggerExit();
        });
      });
    });

    process.on('exit', () => {
      console.log('Killing the runner before exit');
      engine.testRunner.kill();
    });

    return {
      port,
      terminate: () => {
        serverApp.close(() => {
          console.log('Doh :(');
        });
        engine.testRunner.kill();
      }
    };
  });
}
