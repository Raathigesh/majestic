import { vscodePluginStream$, send } from './relay';
import { getTestPatternForTestName } from '../../engine/util';
import remoteInterface from './remote';
import { observable, computed } from 'mobx';
import { show } from './Toaster';
import { Preference } from '.';

export class VsCodeIntegrator {
  public jestExecuablePath: string;
  @observable public vsCodeRootPath: string = 'vscodepath';
  @observable public rootPath: string = 'rootPath';

  constructor(preference: Preference) {
    if (window.location.search === '?vscode=true') {
      preference.isEmbeddedInVSCode = true;
    }

    vscodePluginStream$.subscribe(message => {
      if (message.event === 'workspace-path') {
        this.vsCodeRootPath = message.payload;

        if (this.rootPath.toLowerCase() === this.vsCodeRootPath.toLowerCase()) {
          show('💡 Connected to VSCode');
        }
      }
    });

    this.getDebugInfo();
    this.pingForVsCodeRootPath();
  }

  startDebug(testName: string, filePath: string) {
    send({
      source: 'majestic',
      event: 'start-debugging',
      payload: {
        program: this.jestExecuablePath,
        fileName: filePath,
        identifier: getTestPatternForTestName(testName),
        pathToConfig: undefined,
        rootPath: this.rootPath
      }
    });
  }

  goToTest(path: string, line: number) {
    send({
      source: 'majestic',
      event: 'go-to-test',
      payload: {
        path,
        line
      }
    });
  }

  @computed
  public get isDebuggerReady() {
    return this.rootPath.toLowerCase() === this.vsCodeRootPath.toLowerCase();
  }

  pingForVsCodeRootPath() {
    send({
      source: 'majestic',
      event: 'get-root-path'
    });
  }

  async getDebugInfo() {
    const remote = await remoteInterface;
    const info = await remote.getDebugInfo();
    this.jestExecuablePath = info.jestExecuablePath;
    this.rootPath = info.rootPath;
    console.log(info);
  }
}
