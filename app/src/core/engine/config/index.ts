import craConfigProvider from './craConfig';
import defaultConfigProvider from './defaultConfig';
import jestCliConfigProvider from './defaultConfigCli';
import packageJsonConfig from './packageJsonConfig';

const configs = {
  craConfigProvider,
  defaultConfigProvider,
  jestCliConfigProvider,
  packageJsonConfig
};

export default configs;
