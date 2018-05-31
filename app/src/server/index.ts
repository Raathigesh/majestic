#!/usr/bin/env node
import * as express from 'express';
import * as http from 'http';
import { join } from 'path';
const chalk = require('chalk');
import { bootstrap, register } from '../core/portal/server';
import Engine from '../core/engine';
import getRemoteMethods from './remoteMethods';
import { getConnection } from './relay';
import { ConfigProvider } from '../core/engine/configProvider';
import { ItBlock } from '../core/engine/types/ItBlock';
const chromeLauncher = require('chrome-launcher');
const parseArgs = require('minimist');
const ora = require('ora');

const app = express();
app.use(express.static(join(__dirname, '../../build')));
const server = http.createServer(app);

const projectPath = process.argv[2] || process.cwd();

const configProvider = new ConfigProvider(projectPath);
const engine = new Engine(projectPath, configProvider.getConfig());

const spinner = ora('Reading tests').start();
engine.testFiles.read(engine.root);
spinner.stop();

const port = process.env.PORT || 3005;
server.listen(port, (err: any) => {
  if (err) {
    console.log(err);
  }

  engine.getVersion().then((version: string) => {
    console.log(`
     ${chalk.black.bgYellow.bold(` Majestic v${version} `)}
  ${chalk.white('Zero config UI for Jest')}

visit ${chalk.green(`http://localhost:${port}`)}
    `);

    const args = parseArgs(process.argv);
    if (args.app) {
      chromeLauncher
        .launch({
          startingUrl: `http://localhost:${port}`,
          chromeFlags: [`--app=http://localhost:${port}`]
        })
        .then((chrome: any) => {
          console.log(`Chrome debugging port running on ${chrome.port}`);
        });
    }
  });
});

bootstrap(server).then(() => {
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

getConnection();

process.on('exit', () => {
  console.log('Killing the runner before exit');
  engine.testRunner.kill();
});
