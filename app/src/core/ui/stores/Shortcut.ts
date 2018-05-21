const Mousetrap = require('mousetrap');
import stores from './index';

class Shortcut {
  constructor() {
    Mousetrap.bind(['command+b', 'ctrl+b'], function() {
      stores.preference.toggleTreeview();
    });
  }
}

export default new Shortcut();
