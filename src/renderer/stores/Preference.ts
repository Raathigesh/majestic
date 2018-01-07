import { observable, action } from "mobx";
import Config from "electron-config";
import { pathToJest } from "../util/workspace";
import * as UserSetting from "../constants/user-setting";

export default class Preference {
  @observable isPreferenceOpen: boolean = false;

  @observable rootPath: string = "";
  @observable jestExecutablePath: string = "";
  @observable testFileNamePattern: string = "";
  @observable logToInbuiltConsole = false;
  localJestMajorVersion: number = 20;
  pathToConfig: string = "";

  userSetting = new Config();

  constructor() {
    this.logToInbuiltConsole = this.userSetting.get(
      UserSetting.LogToBuiltInConsole
    );
  }

  initialize(projectPath: string) {
    this.rootPath = projectPath;
    this.jestExecutablePath = pathToJest(
      this.rootPath,
      "node_modules/.bin/jest"
    );
  }

  @action
  setRootPath(value: string) {
    this.rootPath = value;
  }

  @action
  setJestExecutablePath(value: string) {
    this.jestExecutablePath = value;
  }

  @action
  setTestFileNamePattern(value: string) {
    this.testFileNamePattern = value;
  }

  @action
  setPreferenceOpen(toggle: boolean) {
    this.isPreferenceOpen = toggle;
  }

  @action
  setLogToInbuiltConsole(value: boolean) {
    this.logToInbuiltConsole = value;
    this.userSetting.set(UserSetting.LogToBuiltInConsole, value);
  }
}
