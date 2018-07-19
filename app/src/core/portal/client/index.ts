import InvocationHandler from '../InvocationHandler';
import { PortalSocket } from '../types/remote';
import { getSocket } from '../connection';

export default function client(
  name: string,
  clientMethods: any,
  remoteReady: any
) {
  const handler = new InvocationHandler();
  getSocket('client').then((conenction: PortalSocket) => {
    handler.setSocket(conenction);
    handler.registerExtension(name, clientMethods, remoteReady);
  });
}
