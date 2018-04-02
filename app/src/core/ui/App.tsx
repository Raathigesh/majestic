import * as React from 'react';
import { observer } from 'mobx-react';
import Home from './Home';
import Workspace from './stores/Workspace';

import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';

const workspace = new Workspace();

const App = () => <Home workspace={workspace} />;

export default observer(App);
