const { createProcess } = require('jest-editor-support/build/Process');
import { join } from 'path';
import Engine from '.';
import { ChildProcess } from 'child_process';

export default class TestRunner {
  private engine: Engine;
  private jestProcess: ChildProcess;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  public start() {
    this.jestProcess = createProcess(
      {
        rootPath: this.engine.root,
        pathToJest: join(this.engine.root, 'node_modules/.bin/jest.cmd')
      },
      ['--reporters', './src/core/engine/reporter.js']
    );

    this.jestProcess.stdout.on('data', (data: string) => {
      console.log(`stdout: ${data}`);
    });

    this.jestProcess.stderr.on('data', (data: string) => {
      console.log(`stderr: ${data}`);
    });
  }

  public kill() {
    this.jestProcess.kill();
  }
}
