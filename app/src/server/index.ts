import * as express from 'express';
import * as http from 'http';
import { bootstrap, register } from '../core/portal/server';
import Engine from '../core/engine';
import getRemoteMethods from './remoteMethods';
import { getConnection } from './relay';
import getConfig from '../core/engine/config/defaultConfig';
import { ItBlock } from '../core/engine/types/ItBlock';

const app = express();
const server = http.createServer(app);

const engine = new Engine(
  'D:\\sample\\simple-jest',
  getConfig('D:\\sample\\simple-jest')
);
engine.testFiles.read(engine.root);

server.listen(process.env.PORT || 3005, (err: any) => {
  if (err) {
    console.log(err);
  }
  console.log('🚀 started');
});

bootstrap(server).then(() => {
  register('ui', getRemoteMethods(engine), (remote: any) => {
    engine.watcher.handlers(
      (path: string) => {
        remote.onFileAdd(path, engine.testFiles.read(engine.root));
      },
      (path: string) => {
        remote.onFileDelete(path, engine.testFiles.read(engine.root));
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
