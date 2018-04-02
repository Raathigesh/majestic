import Engine from '../core/engine';

export default function getRemoteMethods(engine: Engine) {
  return {
    getFiles() {
      return JSON.stringify(engine.testFiles.files);
    },
    run() {
      engine.testRunner.start();
      return JSON.stringify({});
    }
  };
}
