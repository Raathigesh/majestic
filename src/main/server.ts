import { BrowserWindow } from "electron";

const { ipcMain } = require("electron");
const server = require("http").createServer();
const io = require("socket.io")(server);
const vsCodeConnections = new Map();

export default function initialize(window: BrowserWindow) {
  io.on("connection", socket => {
    console.log("client connected");
    ipcMain.on("startDebug", (event, file) => {
      socket.emit("startDebug", file);
    });

    socket.on("hello", path => {
      console.log("path:", path);
      vsCodeConnections.set(socket.id, path);
      window.webContents.send("vsCodeConnected", path);
    });

    socket.on("disconnect", reason => {
      window.webContents.send(
        "vsCodeDisconnected",
        vsCodeConnections.get(socket.id)
      );
    });
  });
  server.listen(5687);
}
