import { getSocket } from '../connection';
import InvocationHandler from '../InvocationHandler';
const WebSocket = require('ws');
(global as any).WebSocket = WebSocket;

export function register(
  name: string,
  serverMethods: any,
  remoteReady: (remote: any) => void
) {
  const handler = new InvocationHandler();

  getSocket('server').then(socket => {
    handler.setSocket(socket);
    handler.registerExtension(name, serverMethods, remoteReady);
  });
}
