const Sockette = require('sockette');
import { Subject } from 'rxjs';

interface TestResultArg {
  test: any;
  testResult: any;
  aggregatedResult: any;
}
export const testResultStream$ = new Subject<TestResultArg>();

interface RunComplteArg {
  results: any;
}
export const runCompleteStream$ = new Subject<RunComplteArg>();

interface LoggerArg {
  log: any;
}
export const loggerStream$ = new Subject<LoggerArg>();

const ws = new Sockette.default('ws://localhost:7777', {
  timeout: 5e3,
  maxAttempts: 10,
  onmessage: (e: any) => {
    const { event, payload, source } = JSON.parse(e.data);
    if (event === 'onTestResult') {
      for (let item of payload) {
        testResultStream$.next({
          test: item.test,
          testResult: item.testResult,
          aggregatedResult: item.aggregatedResult
        });
      }
    } else if (event === 'onRunComplete') {
      runCompleteStream$.next({
        results: payload.results
      });
    } else if (source === 'majestic-logger') {
      loggerStream$.next(payload);
    }
  },
  onopen: () => {
    ws.send('send');
  }
});
