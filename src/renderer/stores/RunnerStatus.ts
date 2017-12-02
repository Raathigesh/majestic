import { observable, autorun } from "mobx";
import workspace from "./Workspace";

export default class RunnerStatus {
  @observable displayText: string = "";

  construtor() {
    autorun(() => {
      console.log("...running");
      const testFileNamePattern =
        workspace.runner && workspace.runner.testFileNamePattern;
      const testNamePattern =
        workspace.runner && workspace.runner.testNamePattern;
      if (workspace.runner.isRunning) {
        this.displayText = "Booting jest...";
      }

      if (workspace.runner.isWatching) {
        if (testFileNamePattern && testNamePattern) {
          this.displayText = `Watching test ${testNamePattern} in file ${
            testFileNamePattern
          }`;
        } else if (testFileNamePattern) {
          this.displayText = `Watching file ${testNamePattern}`;
        } else if (testNamePattern) {
          this.displayText = `Watching test ${testNamePattern}`;
        }
      }
    });
  }
}
