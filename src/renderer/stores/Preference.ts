import { observable, action } from "mobx";
import { openProjectFolder } from "../util/electron";
import { pathToJest } from "../util/workspace";

export default class Preference {
  @observable isPreferenceOpen: boolean = false;

  @observable rootPath: string = "";
  @observable jestExecutablePath: string = "";
  @observable testFileNamePattern: string = "";
  localJestMajorVersion: number = 20;
  pathToConfig: string = "";

  initialize() {
    return openProjectFolder().then((projectDirectory: string[]) => {
      this.rootPath = projectDirectory[0] as string;
      this.jestExecutablePath = pathToJest(
        this.rootPath,
        "node_modules/.bin/jest"
      );
    });
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
}
