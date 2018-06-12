const WS = require('ws');

let connection: Promise<Connection>;

interface Connection {
  on: (event: string, cb: (message: any) => void) => void;
  send: (event: string, payload: any) => void;
}

export function getConnection(server: any) {
  if (connection) {
    return connection;
  }
  connection = initializeConnection(server);
  return connection;
}

function initializeConnection(server: any) {
  return new Promise<Connection>((resolve, reject) => {
    const wss = new WS.Server({ server });
    wss.on('connection', (ws: any) => {
      ws.on('message', (message: any) => {
        wss.clients.forEach((client: any) => {
          if (client !== ws && client.readyState === WS.OPEN) {
            client.send(message);
          }
        });
      });

      resolve(ws);
    });
  });
}
