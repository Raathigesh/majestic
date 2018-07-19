"use strict";
import * as vscode from "vscode";
import { join } from "path";
const Sockette = require("sockette");
const WebSocket = require("ws");
const majestic = require("D:\\projects\\majestic\\app\\server-build\\server\\index.js")
  .default;
(global as any).WebSocket = WebSocket;

let majesticHandler;

export function activate(context: vscode.ExtensionContext) {
  majestic(vscode.workspace.rootPath, false).then(handler => {
    majesticHandler = handler;

    handleComs();
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
  });
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
  document.getElementById('majesticFrame').contentWindow.postMessage(event.data, '*');
});
 </script>
 <iframe id="majesticFrame" src="http://localhost:3000?vscode=true" height="100%" width="100%" frameborder="0"/>
</body>
</html>`;
}

function handleComs() {
  let connectionPromise = new Promise(resolve => {
    const ws = new Sockette("ws://localhost:" + majesticHandler.port, {
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
        } else if (
          message.source === "majestic" &&
          message.event === "go-to-test"
        ) {
          const { path, line } = message.payload;
          /*  vscode.workspace.openTextDocument(vscode.Uri.file(message.payload)).then(document => {
            document.
          }); */

          vscode.window
            .showTextDocument(vscode.Uri.file(path))
            .then(textDoc => {
              textDoc.selection = new vscode.Selection(
                new vscode.Position(line, 0),
                new vscode.Position(line, 0)
              );
            });

          /* vscode.window.activeTextEditor.revealRange(
            new vscode.Range(
              new vscode.Position(line, 0),
              new vscode.Position(line, 0)
            )
          ); */
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
