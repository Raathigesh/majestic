import * as React from 'react';
import { observer, Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import Home from './Home';
import stores from './stores';
import theme from './theme';

import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';

const App = () => (
  <ThemeProvider theme={theme}>
    <Provider {...stores}>
      <Home
        workspace={stores.workspace}
        debug={stores.debug}
        tests={stores.tests}
        searcher={stores.searcher}
        preference={stores.preference}
        updater={stores.updater}
      />
    </Provider>
  </ThemeProvider>
);

export default observer(App);
