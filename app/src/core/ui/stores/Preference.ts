import { observable } from 'mobx';
import remoteInterface from './remote';

export class Preference {
  @observable public nodePath: string;
  @observable public preferenceModalOpen: boolean;

  constructor() {
    this.fetchPreference();
    this.preferenceModalOpen = false;
  }

  public async fetchPreference() {
    const remote = await remoteInterface;
    const config = await remote.getConfig();

    this.nodePath = config.nodePath;
  }

  public setNodePath(path: string) {
    this.nodePath = path;
  }

  public async saveConfig() {
    const remote = await remoteInterface;
    remote.setConfig(this.nodePath);
  }

  public togglePreferenceModal(toggle: boolean) {
    this.preferenceModalOpen = toggle;
  }
}

export default new Preference();
