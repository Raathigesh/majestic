declare var consola: any;

export function debugLog(tag: string, ...args: any) {
  if (process.env.DEBUG_LOG !== "") {
    consola.info({
      tag,
      args
    });
  }
}

export function executeAndLog(
  tag: string,
  message: string,
  execute: () => any
) {
  if (process.env.DEBUG_LOG !== "") {
    consola.info({
      tag,
      args: [message, execute()]
    });
  }
}

export function createLogger(tag: string) {
  return (...args: any) => debugLog(tag, ...args);
}
