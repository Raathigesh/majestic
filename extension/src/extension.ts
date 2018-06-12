"use strict";
import * as vscode from "vscode";
import { join } from "path";
const Sockette = require("sockette");
const WebSocket = require("ws");
(global as any).WebSocket = WebSocket;

let majesticHandler;

export function activate(context: vscode.ExtensionContext) {
  const majestic = require("D:\\projects\\majestic\\app\\server-build\\server\\index.js")
    .default;

  const majesticHandler = majestic(vscode.workspace.rootPath);

  const panel = vscode.window.createWebviewPanel(
    "majestic",
    "Majestic",
    vscode.ViewColumn.Two,
    { enableScripts: true, retainContextWhenHidden: true }
  );

  vscode.window.onDidChangeActiveTextEditor(editor => {
    panel.webview.postMessage({
      command: "change",
      path: editor.document.fileName
    });
  });

  // And set its HTML content
  panel.webview.html = getWebviewContent();
}

function getWebviewContent() {
  return `
  <style>
    html {
      height: 100%;
      padding: 0;
      overflow: hidden;
      margin-left: -20px;
      margin-right: 20px;
    }
  </style>
  <!DOCTYPE html>
<html lang="en" style="height:100%;width: 100%">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cat Coding</title>

</head>
<body style="height:100%; width: 100%">
<script>

window.addEventListener('message', event => {
  console.log('DATA HERE');
  document.getElementById('majesticFrame').contentWindow.postMessage(event.data, '*');
});
 </script>
 <iframe id="majesticFrame" src="http://localhost:3000?vscode=true" height="100%" width="100%" frameborder="0"/>
</body>
</html>`;
}

function handleComs() {
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
export function deactivate() {
  majesticHandler.terminate();
}
