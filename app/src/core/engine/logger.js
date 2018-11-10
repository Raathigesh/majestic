const WebSocket = require('ws');

let connectionPromise = new Promise(resolve => {
  let connection = new WebSocket('ws://localhost:' + process.env.serverPort);
  connection.on('open', function open() {
    resolve(connection);
    console.log('Connection is open from logger');
  });
});

global.majestic = {
  log() {
    const argsObject = {};

    for (let i = 0, len = arguments.length; i < len; i++) {
      argsObject[`arg${i + 1}`] = arguments[i];
    }

    connectionPromise.then(connection => {
      connection.send(
        JSON.stringify({
          source: 'majestic-logger',
          payload: argsObject
        })
      );
    });
  }
};
