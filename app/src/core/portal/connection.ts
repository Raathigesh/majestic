import { PortalSocket } from './types/remote';

const Sockette = require('sockette');

const SocketteConst = Sockette.default || Sockette;

export function getSocket(name: string) {
  let port = '';
  if (process && process.env.serverPort) {
    port = process.env.serverPort;
  } else {
    port = (window as any).config.serverPort;
  }

  return new Promise<PortalSocket>(resolve => {
    let messageCb = (data: any) => ({});

    const ws = new SocketteConst(`ws://localhost:${port}`, {
      timeout: 5e3,
      maxAttempts: 10,
      onmessage: (e: any) => {
        const data = JSON.parse(e.data);
        messageCb(data);
      },
      onopen: () => {
        resolve({
          on: (cb: any) => {
            messageCb = cb;
          },
          emit: (event, message) => {
            ws.send(
              JSON.stringify({
                event,
                ...message
              })
            );
          }
        });
      }
    });
  });
}
