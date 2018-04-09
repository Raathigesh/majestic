import { join } from 'path';
import Engine from '.';
import { ChildProcess, spawn } from 'child_process';
import { executeInSequence, getTestPatternForPath } from './util';
import { Config } from './types/Config';

export default class TestRunner {
  private engine: Engine;
  private jestProcess: ChildProcess;
  private config: Config;

  constructor(engine: Engine, config: Config) {
    this.engine = engine;
    this.config = config;
  }

  public start(
    watch: boolean = false,
    testFile: string = '',
    testName: string = ''
  ) {
    const patchJsFile = join(__dirname, './patch.js');
    const repoterPath = join(__dirname, './reporter.js');
    this.jestProcess = spawn(
      `node -r ${patchJsFile} ${join(
        this.engine.root,
        this.config.jestScript
      )} `,
      [
        ...(watch ? ['--watchAll'] : []),
        ...(testName
          ? ['--testNamePattern', testName.replace(/\s/g, '.')]
          : []),
        ...(testFile ? [getTestPatternForPath(testFile)] : []),
        '--reporters',
        'default',
        repoterPath,
        ...(this.config.args ? this.config.args : [])
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

  public updateSnapshot(testFile: string, testName: string) {
    return new Promise(resolve => {
      const patchJsFile = join(__dirname, './patch.js');

      const env = process.env || {};
      if (this.config.env) {
        for (const [key, value] of Object.entries(this.config.env)) {
          env[key] = value as string;
        }
      }

      const updateProcess = spawn(
        `node -r ${patchJsFile} ${join(
          this.engine.root,
          this.config.jestScript
        )} `,
        [
          '--updateSnapshot',
          ...(testName
            ? ['--testNamePattern', testName.replace(/\s/g, '.')]
            : []),
          ...(testFile ? [getTestPatternForPath(testFile)] : [])
        ],
        {
          cwd: this.engine.root,
          shell: true,
          stdio: 'pipe',
          env
        }
      );

      updateProcess.on('close', () => {
        resolve(JSON.stringify({}));
      });
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

  public runTestByTestNameInteractive(testFileName: string, testName: string) {
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
      },
      {
        fn: () => this.jestProcess.stdin.write('t'),
        delay: 200
      },
      {
        fn: () => this.jestProcess.stdin.write(testName),
        delay: 500
      },
      {
        fn: () =>
          this.jestProcess.stdin.write(new Buffer('0d', 'hex').toString()),
        delay: 200
      }
    ]);
  }
}
