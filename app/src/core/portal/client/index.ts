import * as io from 'socket.io-client';
import InvocationHandler from '../InvocationHandler';

const socket = io('http://localhost:3005');
const handler = new InvocationHandler(socket);

export default function client(
  name: string,
  clientMethods: any,
  remoteReady: any
) {
  handler.setSocket(socket, socket);
  handler.registerExtension(name, clientMethods, remoteReady);
}
