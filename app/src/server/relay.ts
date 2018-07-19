const WS = require('ws');

export function getConnection(server: any) {
  initializeConnection(server);
}

function initializeConnection(server: any) {
  const wss = new WS.Server({ server });
  wss.on('connection', (ws: any) => {
    ws.on('message', (message: any) => {
      wss.clients.forEach((client: any) => {
        if (client !== ws && client.readyState === WS.OPEN) {
          client.send(message);
        }
      });
    });
  });
}
