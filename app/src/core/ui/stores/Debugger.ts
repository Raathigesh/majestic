import { observable, IObservableArray, computed } from 'mobx';
import Node from './Node';
import It from './It';
import { default as remoteInterface, debuggerExitStream$ } from './remote';
import { loggerStream$ } from './relay';

export class Debugger {
  @observable public debugUrl: string = '';
  @observable public showDebugPanel: boolean = false;
  @observable public running: boolean = false;
  @observable public logs: IObservableArray<any> = observable([]);

  constructor() {
    debuggerExitStream$.subscribe(() => {
      this.stopDebugger();
    });

    loggerStream$.subscribe((log: any) => {
      if (typeof log === 'string') {
        this.logs.push({
          text: log
        });
      } else {
        this.logs.push(log);
      }
    });
  }

  public setDebugUrl(url: string) {
    this.debugUrl = url;
  }

  public toggleDebugPanel(toggle: boolean) {
    this.showDebugPanel = toggle;
  }

  public async launchInEditor(file: Node, test: It) {
    const remote = await remoteInterface;
    remote.launchInEditor(file.path, test.line);
  }

  public stopDebugger() {
    this.running = false;
  }

  public async startDebugging(node: Node) {
    this.running = true;
    const remote = await remoteInterface;
    const debugResult: any = await remote.startDebugging(node.path);
    this.setDebugUrl(debugResult.url);
    this.toggleDebugPanel(true);
  }

  @computed
  public get isLogsAvailable() {
    return this.logs.length > 0;
  }

  public clearLogs() {
    this.logs.clear();
  }
}

export default new Debugger();
