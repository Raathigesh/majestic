import { Machine } from 'xstate';

const RunnerMachine = Machine({
  key: 'runner',
  initial: 'stopped',
  states: {
    stopped: {
      on: {
        run: 'running',
        watch: 'watching'
      }
    },
    running: {
      on: {
        complete: 'stopped',
        stop: 'stopped'
      }
    },
    watching: {
      on: {
        complete: 'watching',
        stop: 'stopped'
      }
    }
  }
});

export default RunnerMachine;
