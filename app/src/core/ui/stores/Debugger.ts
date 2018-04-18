import { observable } from 'mobx';
import Node from './Node';
import It from './It';
import { default as remoteInterface, debuggerExitStream$ } from './remote';

export class Debugger {
  @observable public debugUrl: string = '';
  @observable public showDebugPanel: boolean = false;
  @observable public running: boolean = false;

  constructor() {
    debuggerExitStream$.subscribe(() => {
      this.stopDebugger();
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

  public async startDebugging(node: Node, test: It) {
    this.running = true;
    const remote = await remoteInterface;
    const debugResult: any = await remote.startDebugging(node.path, test.name);
    this.setDebugUrl(debugResult.url);
    this.toggleDebugPanel(true);
  }
}

export default new Debugger();
