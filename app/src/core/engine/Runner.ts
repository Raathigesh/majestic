import { join } from 'path';
import Engine from '.';
import { ChildProcess, spawn } from 'child_process';
import { executeInSequence, getTestPatternForPath } from './util';

export default class TestRunner {
  private engine: Engine;
  private jestProcess: ChildProcess;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  public start(
    watch: boolean = false,
    testFile: string = '',
    testName: string = ''
  ) {
    const patchJsFile = join(this.engine.root, './src/core/engine/patch.js');
    this.jestProcess = spawn(
      `node -r ${patchJsFile} ${join(
        this.engine.root,
        './node_modules/jest-cli/bin/jest.js'
      )} `,
      [
        ...(watch ? ['--watchAll'] : []),
        ...(testName ? ['--testNamePattern', testName] : []),
        ...(testFile ? [getTestPatternForPath(testFile)] : []),
        '--reporters',
        'default',
        './src/core/engine/reporter.js'
      ],
      {
        cwd: this.engine.root,
        shell: true,
        stdio: 'pipe'
      }
    );

    this.jestProcess.stdout.on('data', (data: string) => {
      console.log(data.toString().trim());
    });

    this.jestProcess.stderr.on('data', (data: string) => {
      console.log(data.toString().trim());
    });

    this.jestProcess.on('close', code => {
      console.log(`child process exited with code ${code}`);
    });

    this.jestProcess.on('exit', code => {
      console.log(`cthis is exit`);
    });
  }

  public kill() {
    if (process.platform === 'win32') {
      // Windows doesn't exit the process when it should.
      spawn('taskkill', ['/pid', '' + this.jestProcess.pid, '/T', '/F']);
    } else {
      this.jestProcess.kill();
    }
  }

  public runTestByFileInteractive(testFileName: string) {
    executeInSequence([
      {
        fn: () => this.jestProcess.stdin.write('p'),
        delay: 0
      },
      {
        fn: () =>
          this.jestProcess.stdin.write(getTestPatternForPath(testFileName)),
        delay: 100
      },
      {
        fn: () =>
          this.jestProcess.stdin.write(new Buffer('0d', 'hex').toString()),
        delay: 200
      }
    ]);
  }
}
