module.exports = async function setup() {
  const WebSocket = require('ws');

  let connectionPromise = new Promise(resolve => {
    let connection = new WebSocket('ws://localhost:7777');
    connection.on('open', function open() {
      resolve(connection);
      global.connection = connection;
      console.log('Connection is open global connector');
    });
  });

  global.connectionPromise = connectionPromise;

  return connectionPromise;
};
