const { join } = require('path');
export function resolveJestCliPath(moduleName: string, suffix: string) {
  const path = require
    .resolve(`${moduleName}/package.json`)
    .replace('package.json', '');

  return join(path, suffix);
}
