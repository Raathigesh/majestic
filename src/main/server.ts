import { BrowserWindow } from "electron";

const { ipcMain } = require("electron");
const server = require("http").createServer();
const io = require("socket.io")(server);
const vsCodeConnections = new Map();

function getRootPaths() {
  const paths = [];

  for (const connection of vsCodeConnections) {
    paths.push(connection[1]);
  }

  return paths;
}

export default function initialize(window: BrowserWindow) {
  ipcMain.on("getVsCodeConnections", () => {
    window.webContents.send("vsCodeConnectionsChange", getRootPaths());
  });

  io.on("connection", socket => {
    ipcMain.on("startDebug", (event, file) => {
      socket.emit("startDebug", file);
    });

    socket.on("hello", path => {
      console.log("path:", path);
      vsCodeConnections.set(socket.id, path);
      console.log("connection", getRootPaths());
      window.webContents.send("vsCodeConnectionsChange", getRootPaths());
    });

    socket.on("disconnect", reason => {
      vsCodeConnections.delete(socket.id);
      console.log("disconnection", getRootPaths());
      window.webContents.send("vsCodeConnectionsChange", getRootPaths());
    });
  });
  server.listen(5687);
}
