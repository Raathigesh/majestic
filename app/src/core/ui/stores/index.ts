import workspace from './Workspace';
import debug from './Debugger';
import tests from './Tests';
import searcher from './Searcher';
import preference from './Preference';
import updater from './Updater';
import shortcut from './Shortcut';
import { VsCodeIntegrator } from './VsCodeIntegrator';

export { Workspace } from './Workspace';
export { Debugger } from './Debugger';
export { Tests } from './Tests';
export { Searcher } from './Searcher';
export { Preference } from './Preference';
export { Updater } from './Updater';
export { default as Node } from './Node';

const stores = {
  workspace,
  debug,
  tests,
  searcher,
  preference,
  updater,
  shortcut,
  vsCodeIntegrator: new VsCodeIntegrator(preference)
};

export default stores;
