"use strict";
import * as vscode from "vscode";
import { join } from "path";
const Sockette = require("sockette");
const WebSocket = require("ws");
(global as any).WebSocket = WebSocket;

export function activate(context: vscode.ExtensionContext) {
  let connectionPromise = new Promise(resolve => {
    const ws = new Sockette("ws://localhost:7777", {
      onopen: e => {
        ws.send(
          JSON.stringify({
            source: "vscode-majestic",
            event: "workspace-path",
            payload: vscode.workspace.rootPath
          })
        );
        resolve(ws);
      },
      onreconnect: () => {
        ws.send(
          JSON.stringify({
            source: "vscode-majestic",
            event: "workspace-path",
            payload: vscode.workspace.rootPath
          })
        );
      },
      onmessage: payload => {
        const message = JSON.parse(payload.data);
        if (
          message.source === "majestic" &&
          message.event === "start-debugging"
        ) {
          startDebugging(message.payload);
        } else if (
          message.source === "majestic" &&
          message.event === "get-root-path"
        ) {
          ws.send(
            JSON.stringify({
              source: "vscode-majestic",
              event: "workspace-path",
              payload: vscode.workspace.rootPath
            })
          );
        }
      }
    });
  });
  connectionPromise.then((connection: any) => {
    connection.send(
      JSON.stringify({
        source: "vscode-majestic",
        event: "workspace-path",
        payload: vscode.workspace.rootPath
      })
    );
  });
}

function startDebugging(config) {
  if (
    config.rootPath.toLowerCase() !== vscode.workspace.rootPath.toLowerCase()
  ) {
    return;
  }

  const args = [
    "--runInBand",
    getTestPatternForPath(config.fileName),
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
    program: join(config.rootPath, config.program),
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
}

function getTestPatternForPath(filePath: string) {
  let replacePattern = /\//g;

  if (process.platform === "win32") {
    replacePattern = /\\/g;
  }

  return `^${filePath.replace(replacePattern, ".")}$`;
}

// this method is called when your extension is deactivated
export function deactivate() {}
