const fetch = require("node-fetch");

function send(type, body) {
  fetch("http://localhost:4000/" + type, {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" }
  });
}

class MyCustomReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
    this.testStartQueue = [];
    this.testResultQueue = [];
    this.onRunStartQueue = [];
  }

  onTestStart(test) {
    send("test-start", {
      path: test.path
    });
  }

  onTestResult(test, testResult, aggregatedResult) {
    send("test-result", {
      testResult,
      aggregatedResult
    });
  }

  onRunStart(results) {
    /*  connectionPromise.then(connection => {
      connection.send(
        JSON.stringify({
          source: "jest-test-reporter",
          event: "onRunStart",
          payload: {
            results
          }
        })
      );
    }); */
  }

  onRunComplete(contexts, results) {
    /*  connectionPromise.then(connection => {
      connection.send(
        JSON.stringify({
          source: "jest-test-reporter",
          event: "onRunComplete",
          payload: {
            results,
            contexts
          }
        })
      );
    }); */
  }
}

module.exports = MyCustomReporter;
