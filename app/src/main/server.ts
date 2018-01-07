import { BrowserWindow, ipcMain } from "electron";
import http from "http";
import Socket from "socket.io";

const server = http.createServer();
const io = Socket(server);
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
      // tslint:disable-next-line
      console.log("path:", path);
      vsCodeConnections.set(socket.id, path);
      // tslint:disable-next-line
      console.log("connection", getRootPaths());
      window.webContents.send("vsCodeConnectionsChange", getRootPaths());
    });

    socket.on("disconnect", reason => {
      vsCodeConnections.delete(socket.id);
      // tslint:disable-next-line
      console.log("disconnection", getRootPaths());
      window.webContents.send("vsCodeConnectionsChange", getRootPaths());
    });
  });
  server.listen(5687);
}
