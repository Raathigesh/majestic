"use strict";
import * as vscode from "vscode";
const io = require("socket.io-client");
const socket = io("http://localhost:5687");

socket.on("connect", _ => {
  socket.emit("hello", vscode.workspace.rootPath);
});

export function activate(context: vscode.ExtensionContext) {
  socket.on("startDebug", config => {
    const launchConfig = vscode.workspace.getConfiguration("launch");
    if (
      config.rootPath.toLowerCase() !== vscode.workspace.rootPath.toLowerCase()
    ) {
      return;
    }

    const args = [
      "--runInBand",
      config.fileName,
      "--testNamePattern",
      config.identifier
    ];
    if (config.pathToConfig) {
      args.push("--config", config.pathToConfig);
    }

    const port = Math.floor(Math.random() * 20000) + 10000;
    const configuration = {
      name: "TestRunner",
      type: "node",
      request: "launch",
      program: config.program,
      args,
      runtimeArgs: ["--inspect-brk=" + port],
      port,
      protocol: "inspector",
      console: "integratedTerminal",
      smartStep: true,
      sourceMaps: true
    };

    vscode.debug.startDebugging(
      vscode.workspace.workspaceFolders[0],
      configuration
    );
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
