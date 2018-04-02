const socket = require('socket.io');
import InvocationHandler from '../InvocationHandler';
let io: any = null;
let handler: InvocationHandler;

export function bootstrap(server: any) {
  return new Promise(resolve => {
    io = socket(server);
    handler = new InvocationHandler(io);
    io.on('connection', (client: any) => {
      handler.setSocket(io, client);
      resolve();
    });
  });
}

export function register(
  name: string,
  serverMethods: any,
  remoteReady: (remote: any) => void
) {
  handler.registerExtension(name, serverMethods, remoteReady);
}
