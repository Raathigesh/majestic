import { platform } from 'os';
import { existsSync } from 'fs';
import { join } from 'path';
const readPkgUp = require('read-pkg-up');
import configProviders from './config';

export class ConfigProvider {
  private rootPath: string;

  constructor(rootPath: string) {
    this.rootPath = rootPath;
  }

  public getConfig() {
    if (this.isBootstrappedWithCreateReactApp(this.rootPath)) {
      return configProviders.craConfigProvider(this.rootPath);
    } else if (this.usesJestCli()) {
      return configProviders.jestCliConfigProvider(this.rootPath);
    }

    return configProviders.defaultConfigProvider(this.rootPath);
  }

  private usesJestCli() {
    const results = readPkgUp.sync({
      cwd: this.rootPath
    });

    return Boolean(
      (results.pkg.dependencies && results.pkg.dependencies['jest-cli']) ||
        (results.pkg.devDependencies && results.pkg.devDependencies['jest-cli'])
    );
  }

  private isBootstrappedWithCreateReactApp(rootPath: string): boolean {
    return (
      this.hasExecutable(rootPath, 'node_modules/.bin/react-scripts') ||
      this.hasExecutable(
        rootPath,
        'node_modules/react-scripts/node_modules/.bin/jest'
      ) ||
      this.hasExecutable(rootPath, 'node_modules/react-native-scripts')
    );
  }

  private hasExecutable(rootPath: string, executablePath: string): boolean {
    const ext = platform() === 'win32' ? '.cmd' : '';
    const absolutePath = join(rootPath, executablePath + ext);
    return existsSync(absolutePath);
  }
}
