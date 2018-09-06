import { observable, computed } from 'mobx';
import remoteInterface from './remote';

export class Preference {
  @observable
  public nodePath: string;
  @observable
  public preferenceModalOpen: boolean;
  @observable
  public showTreeView: boolean;
  @observable
  public isMajesticLogEnabled: boolean;
  @observable
  public isEmbeddedInVSCode: boolean;

  constructor() {
    this.fetchPreference();
    this.preferenceModalOpen = false;
    this.showTreeView = true;
    this.isMajesticLogEnabled = false;
    this.isEmbeddedInVSCode = false;
  }

  public async fetchPreference() {
    const remote = await remoteInterface;
    const config = await remote.getConfig();
    this.nodePath = config.nodePath;
    this.isMajesticLogEnabled = config.isMajesticLogEnabled;
    this.showTreeView =
      config.showTreeView === undefined ? true : config.showTreeView;
  }

  public setNodePath(path: string) {
    this.nodePath = path;
  }

  public async saveConfig() {
    const remote = await remoteInterface;
    remote.setConfig(
      this.nodePath,
      this.showTreeView,
      this.isMajesticLogEnabled
    );
  }

  public togglePreferenceModal(toggle: boolean) {
    this.preferenceModalOpen = toggle;
  }

  public toggleTreeview() {
    this.showTreeView = !this.showTreeView;
    this.saveConfig();
  }

  public toggleIsMajesticLogEnabled() {
    this.isMajesticLogEnabled = !this.isMajesticLogEnabled;
    this.saveConfig();
  }

  @computed
  public get shouldShowTreeView() {
    return this.showTreeView;
  }

  @computed
  public get shouldShowSummaryPanel() {
    if (this.isEmbeddedInVSCode) {
      return false;
    }

    return true;
  }
}

export default new Preference();
