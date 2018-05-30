import Engine from '../core/engine';
const latestVersion = require('latest-version');

export default function getRemoteMethods(engine: Engine) {
  return {
    getFiles() {
      return JSON.stringify(engine.testFiles.read(engine.root));
    },
    run(
      watch: boolean,
      disableCoverage: boolean,
      testFile: string = '',
      testName: string = ''
    ) {
      engine.testRunner.start(watch, disableCoverage, testFile, testName);
      return JSON.stringify({});
    },
    stop() {
      engine.testRunner.kill();
      return JSON.stringify({});
    },
    filterFileInWatch(fileName: string) {
      engine.testRunner.runTestByFileInteractive(fileName);
      return JSON.stringify({});
    },
    filterTestInWatch(fileName: string, testName: string) {
      engine.testRunner.runTestByTestNameInteractive(fileName, testName);
      return JSON.stringify({});
    },
    updateSnapshot(fileName: string, testName: string) {
      return engine.testRunner.updateSnapshot(fileName, testName);
    },
    launchInEditor(fileName: string, lineNumber: number) {
      engine.launchEditor(fileName, lineNumber);
      return JSON.stringify({});
    },
    startDebugging(fileName: string, testName: string) {
      return engine.testRunner.startInspect(fileName, testName);
    },
    getConfig() {
      return JSON.stringify({
        nodePath: engine.preference.getNodePath(),
        showTreeView: engine.preference.getTreeViewToggle(),
        isMajesticLogEnabled: engine.preference.getMajesticLogEnabled()
      });
    },
    setConfig(
      nodePath: string,
      showTreeView: boolean,
      isMajesticLogEnabled: boolean
    ) {
      engine.preference.setNodePath(nodePath);
      engine.preference.setShowTreeView(showTreeView);
      engine.preference.setMajesticLogEnabled(isMajesticLogEnabled);
      return JSON.stringify({});
    },
    getVersion() {
      return engine.getVersion().then((version: number) => {
        return JSON.stringify({
          version
        });
      });
    },
    getLatestVersion() {
      return latestVersion('majestic').then((version: number) =>
        JSON.stringify({
          version
        })
      );
    },
    getDebugInfo() {
      return JSON.stringify({
        rootPath: engine.root,
        jestExecuablePath: engine.testRunner.getJestExecutablePath()
      });
    }
  };
}
