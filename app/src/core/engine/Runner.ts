import { join } from 'path';
import Engine from '.';
import fetch from 'node-fetch';
const consola = require('consola');
import { ChildProcess, spawn } from 'child_process';
import {
  executeInSequence,
  getTestPatternForPath,
  getTestPatternForTestName
} from './util';
import { Config } from './types/Config';
import Preference from './Preference';
const logger = consola.withScope('Runner');

export default class TestRunner {
  private engine: Engine;
  private jestProcess: ChildProcess;
  private config: Config;
  private onDebuggerExit: () => void;
  private inspectProcess: ChildProcess;
  private preference: Preference;
  private environmentVariables: any = {};

  constructor(
    engine: Engine,
    config: Config,
    preference: Preference,
    environmentVariables: any = {}
  ) {
    this.engine = engine;
    this.config = config;
    this.preference = preference;
    this.environmentVariables = environmentVariables;
  }

  public start(
    watch: boolean = false,
    disableCoverageCollection: boolean = true,
    testFile: string = '',
    testName: string = ''
  ) {
    const patchJsFile = join(__dirname, './patch.js');
    const repoterPath = join(__dirname, './reporter.js');
    const loggerPath = join(__dirname, './logger.js');
    // const teardown = join(__dirname, './teardown.js');
    const NodeExecutable = this.preference.getNodePath()
      ? this.preference.getNodePath()
      : 'node';

    const setupFilesArg = [
      ...(this.preference.getMajesticLogEnabled() ? [loggerPath] : []),
      ...(this.config.jest.setupFiles || [])
    ];
    const jestScript = join(this.engine.root, this.config.jestScript);

    logger.success(`Starting jest with:
                      📈 Coverage collection: ${!disableCoverageCollection}`);

    this.jestProcess = spawn(
      `${NodeExecutable} -r ${patchJsFile} ${jestScript}`,
      [
        ...(watch ? ['--watchAll'] : []),
        ...(testName
          ? ['--testNamePattern', getTestPatternForTestName(testName)]
          : []),
        ...(testFile ? [getTestPatternForPath(testFile)] : []),
        ...['--reporters', 'default', repoterPath],
        ...['--setupFiles', ...setupFilesArg],
        ...(disableCoverageCollection ? [] : ['--collectCoverage=false']),
        ...(this.config.args ? this.config.args : [])
        // ...['--globalTeardown', teardown]
      ],
      {
        cwd: this.engine.root,
        shell: true,
        stdio: 'pipe',
        env: this.getEnvironment()
      }
    );

    this.jestProcess.stdout.on('data', (data: string) => {
      consola.info(data.toString().trim());
    });

    this.jestProcess.stderr.on('data', (data: string) => {
      consola.info(data.toString().trim());
    });

    this.jestProcess.on('exit', code => {
      consola.warn('Jest process did exit');
    });
  }

  public updateSnapshot(testFile: string, testName: string) {
    return new Promise(resolve => {
      const patchJsFile = join(__dirname, './patch.js');
      const loggerPath = join(__dirname, './mockLogger.js');
      const setupFilesArg = [
        loggerPath,
        ...(this.config.jest.setupFiles || [])
      ];
      const updateProcess = spawn(
        `node -r ${patchJsFile} ${join(
          this.engine.root,
          this.config.jestScript
        )} `,
        [
          ...['--setupFiles', ...setupFilesArg],
          '--updateSnapshot',
          ...(testName
            ? ['--testNamePattern', getTestPatternForTestName(testName)]
            : []),
          ...(testFile ? [getTestPatternForPath(testFile)] : [])
        ],
        {
          cwd: this.engine.root,
          shell: true,
          stdio: 'pipe',
          env: this.getEnvironment()
        }
      );

      updateProcess.on('close', () => {
        resolve(JSON.stringify({}));
      });
    });
  }

  public startInspect(testFile: string) {
    return new Promise(resolve => {
      // kill the existing inspect process
      this.kill(this.inspectProcess);
      const inspectProcess = spawn(
        `node --inspect-brk ${join(this.engine.root, this.config.jestScript)} `,
        [...(testFile ? [getTestPatternForPath(testFile)] : [])],
        {
          cwd: this.engine.root,
          shell: true,
          stdio: 'pipe',
          env: this.getEnvironment()
        }
      );

      inspectProcess.stdout.on('data', data => {
        console.log(`ps stderr: ${data}`);
      });

      inspectProcess.stderr.on('data', data => {
        console.log(`ps stderr: ${data}`);
      });

      inspectProcess.on('close', () => {
        if (this.onDebuggerExit) {
          this.onDebuggerExit();
        }
      });

      this.getDebuggerUrl().then(url => {
        resolve(
          JSON.stringify({
            url
          })
        );
      });
    });
  }

  public registerOnDebuggerExit(callback: () => void) {
    this.onDebuggerExit = callback;
  }

  public kill(processToKill: ChildProcess = this.jestProcess) {
    if (!processToKill) {
      return;
    }

    if (process.platform === 'win32') {
      // Windows doesn't exit the process when it should.
      spawn('taskkill', ['/pid', '' + processToKill.pid, '/T', '/F']);
    } else {
      processToKill.kill();
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

  public getJestExecutablePath() {
    return this.config.jestScript;
  }

  private getEnvironment() {
    const env = process.env || {};
    if (this.config.env) {
      for (const [key, value] of Object.entries(this.config.env)) {
        env[key] = value as string;
      }
    }

    return {
      ...env,
      ...this.environmentVariables
    };
  }

  private getDebuggerUrl() {
    return fetch('http://localhost:9229/json')
      .then((response: any) => {
        return response.json();
      })
      .then((debugInfo: any) => {
        return `chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=localhost:9229/${
          debugInfo[0].id
        }`;
      });
  }
}
