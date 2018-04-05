export async function executeInSequence(
  funcs: Array<{
    fn: () => void;
    delay: number;
  }>
) {
  for (const { fn, delay } of funcs) {
    await setTimeoutPromisify(fn, delay);
  }
}

function setTimeoutPromisify(fn: () => void, delay: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      fn();
      resolve();
    }, delay);
  });
}

export function getTestPatternForPath(filePath: string) {
  let replacePattern = /\//g;

  if (process.platform === 'win32') {
    replacePattern = /\\/g;
  }

  return `^${filePath.replace(replacePattern, '.')}$`;
}
