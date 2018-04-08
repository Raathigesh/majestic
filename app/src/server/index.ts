import * as express from 'express';
import * as http from 'http';
import { bootstrap, register } from '../core/portal/server';
import Engine from '../core/engine';
import getRemoteMethods from './remoteMethods';
import { getConnection } from './relay';
import getConfig from '../core/engine/config/craConfig';

const app = express();
const server = http.createServer(app);

const engine = new Engine('D:\\sample\\majestic-cra-integration', getConfig());
engine.testFiles.read(engine.root);

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
