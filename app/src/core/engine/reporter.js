const WebSocket = require('ws');

let connectionPromise = new Promise(resolve => {
  let connection = new WebSocket('ws://localhost:7777');
  connection.on('open', function open() {
    resolve(connection);
    console.log('connection is open from repoter');
  });
});

class MyCustomReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  onTestStart(test) {
    connectionPromise.then(connection => {
      connection.send(
        JSON.stringify({
          source: 'jest-test-reporter',
          event: 'onTestStart',
          payload: {
            test
          }
        })
      );
    });
  }

  onTestResult(test, testResult, aggregatedResult) {
    connectionPromise.then(connection => {
      connection.send(
        JSON.stringify({
          source: 'jest-test-reporter',
          event: 'onTestResult',
          payload: {
            test,
            testResult,
            aggregatedResult
          }
        })
      );
    });
  }

  onRunStart(results) {
    connectionPromise.then(connection => {
      connection.send(
        JSON.stringify({
          source: 'jest-test-reporter',
          event: 'onRunStart',
          payload: {
            results
          }
        })
      );
    });
  }

  onRunComplete(contexts, results) {
    connectionPromise.then(connection => {
      connection.send(
        JSON.stringify({
          source: 'jest-test-reporter',
          event: 'onRunComplete',
          payload: {
            results
          }
        })
      );
    });
  }
}

module.exports = MyCustomReporter;
