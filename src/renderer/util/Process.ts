var pty = require("node-pty");
var os = require("os");
/**
 * Spawns and returns a Jest process with specific args
 *
 * @param {string[]} args
 * @returns {ChildProcess}
 */
export const createProcess = (workspace: any, args: Array<string>): any => {
  // A command could look like `npm run test`, which we cannot use as a command
  // as they can only be the first command, so take out the command, and add
  // any other bits into the args
  const runtimeExecutable = workspace.pathToJest;
  const parameters = runtimeExecutable.split(" ");
  const command = parameters[0];
  const initialArgs = parameters.slice(1);
  const runtimeArgs = [].concat(initialArgs, args);

  // If a path to configuration file was defined, push it to runtimeArgs
  const configPath = workspace.pathToConfig;
  if (configPath !== "") {
    runtimeArgs.push("--config");
    runtimeArgs.push(configPath);
  }

  // To use our own commands in create-react, we need to tell the command that
  // we're in a CI environment, or it will always append --watch
  const env = process.env;
  env["CI"] = "true";
  // return pty.spawn(command, runtimeArgs, { cwd: workspace.rootPath, env });

  let stdoutCallback = (data: any) => {};
  let onExitCallback = () => {};

  const ptyProcess = pty.spawn(command, runtimeArgs, {
    name: "xterm-color",
    cols: 80,
    rows: 30,
    cwd: workspace.rootPath,
    env: env
  });

  ptyProcess.on("data", function(data) {
    let output = data;
    if (data.includes("Test results written to")) {
      output = data.substring(data.indexOf("Test results written to"));
    }
    stdoutCallback(output);
  });

  ptyProcess.on("exit", () => {
    onExitCallback();
  });

  return {
    stdout: {
      on(name, callback) {
        if (name === "data") {
          stdoutCallback = callback;
        }
      }
    },
    stdin: {
      write(value: string) {
        ptyProcess.write(value);
      }
    },
    stderr: {
      on() {}
    },
    on(eventName, callback) {
      if (eventName === "debuggerProcessExit") {
        onExitCallback = callback;
      }
    },
    kill() {
      ptyProcess.kill();
    }
  };
};
