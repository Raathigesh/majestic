const Conf = require('conf');

export default class Preference {
  public config: any;
  public NodePath: string = 'ConfigNodePath';
  public ShowTreeView: string = 'ShowTreeView';

  constructor() {
    this.config = new Conf();
  }

  setNodePath(path: string) {
    this.config.set(this.NodePath, path);
  }

  getNodePath() {
    return this.config.get(this.NodePath);
  }

  setShowTreeView(toggle: boolean) {
    this.config.set(this.ShowTreeView, toggle);
  }

  getTreeViewToggle() {
    return this.config.get(this.ShowTreeView);
  }
}
