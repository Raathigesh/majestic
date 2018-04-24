import { observable } from 'mobx';
const semver = require('semver');
import remoteInterface from './remote';
import { show } from './Toaster';

export class Updater {
  @observable public version: number;
  @observable public latestVersion: number;

  constructor() {
    this.getVersion();
  }

  public async getVersion() {
    const remote = await remoteInterface;
    const result = await remote.getVersion();
    this.version = result.version;

    const latestVersion = await remote.getLatestVersion();

    if (semver.gt(latestVersion.version, this.version)) {
      show('🎉🎉🎉 New version of Majestic is available!');
    }
  }
}

export default new Updater();
