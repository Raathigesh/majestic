const { join } = require('path');
const resolvePkg = require('resolve-pkg');

export function resolveJestCliPath(
  rootDir: string,
  moduleName: string,
  suffix: string
) {
  const path = resolvePkg(`${moduleName}`, {
    cwd: rootDir
  });

  return join(path, suffix);
}
