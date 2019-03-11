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
  }

  onTestStart(test) {
    send("test-start", {
      path: test.path
    });
  }

  onTestResult(test, testResult, aggregatedResult) {
    send("test-result", {
      path: testResult.testFilePath,
      failureMessage: testResult.failureMessage,
      numFailingTests: testResult.numFailingTests,
      numPassingTests: testResult.numPassingTests,
      numPendingTests: testResult.numPendingTests,
      testResults: (testResult.testResults || []).map(result => ({
        title: result.title,
        numPassingAsserts: result.numPassingAsserts,
        status: result.status,
        failureMessages: result.failureMessages,
        ancestorTitles: result.ancestorTitles,
        duration: result.duration
      })),
      aggregatedResult: {
        numFailedTests: aggregatedResult.numFailedTests,
        numPassedTests: aggregatedResult.numPassedTests,
        numPassedTestSuites: aggregatedResult.numPassedTestSuites,
        numFailedTestSuites: aggregatedResult.numFailedTestSuites
      }
    });
  }

  onRunStart(results) {}

  onRunComplete(contexts, results) {}
}

module.exports = MyCustomReporter;
