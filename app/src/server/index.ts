import * as express from 'express';
import * as http from 'http';
import { join } from 'path';
import { bootstrap, register } from '../core/portal/server';
import Engine from '../core/engine';
import getRemoteMethods from './remoteMethods';
import { getConnection } from './relay';

const app = express();
const server = http.createServer(app);

const engine = new Engine(join(process.cwd(), 'app'));
console.log(engine.testFiles.read(engine.root));

server.listen(process.env.PORT || 3005, (err: any) => {
  if (err) {
    console.log(err);
  }
  console.log('🚀 started');
});

bootstrap(server).then(() => {
  register('ui', getRemoteMethods(engine), (remote: any) => {
    return null;
  });
});

getConnection();

process.on('exit', () => {
  console.log('Killing the runner before exit');
  engine.testRunner.kill();
});
