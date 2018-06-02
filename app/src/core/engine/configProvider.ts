import { platform } from 'os';
import { existsSync } from 'fs';
import { join } from 'path';
const readPkgUp = require('read-pkg-up');
import configProviders from './config';

export class ConfigProvider {
  private rootPath: string;
  private packageJsonObj: any;

  constructor(rootPath: string) {
    this.rootPath = rootPath;
    this.packageJsonObj = readPkgUp.sync({
      cwd: this.rootPath
    }).pkg;
  }

  public getConfig() {
    if (this.packageJsonHasConfig()) {
      const majesticCofig = this.packageJsonObj.majestic;
      const config = configProviders.packageJsonConfig(
        this.rootPath,
        majesticCofig
      );
      return config;
    } else if (this.isBootstrappedWithCreateReactApp(this.rootPath)) {
      return configProviders.craConfigProvider(this.rootPath);
    } else if (this.usesJestCli()) {
      return configProviders.jestCliConfigProvider(this.rootPath);
    }

    return configProviders.defaultConfigProvider(this.rootPath);
  }

  private packageJsonHasConfig() {
    return Boolean(this.packageJsonObj.majestic);
  }

  private usesJestCli() {
    return Boolean(
      (this.packageJsonObj.dependencies &&
        this.packageJsonObj.dependencies['jest-cli']) ||
        (this.packageJsonObj.devDependencies &&
          this.packageJsonObj.devDependencies['jest-cli'])
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
