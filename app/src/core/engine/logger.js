const WebSocket = require('ws');

let connectionPromise = new Promise(resolve => {
  let connection = new WebSocket('ws://localhost:7777');
  connection.on('open', function open() {
    resolve(connection);
    console.log('Connection is open from logger');
  });
});

global.majestic = {
  log(args) {
    connectionPromise.then(connection => {
      connection.send(
        JSON.stringify({
          source: 'majestic-logger',
          payload: args
        })
      );
    });
  }
};
