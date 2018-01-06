const { ipcMain } = require("electron");
const server = require("http").createServer();
const io = require("socket.io")(server);

io.on("connection", socket => {
  console.log("client connected");
  ipcMain.on("startDebug", (event, file) => {
    socket.emit("startDebug", file);
  });
});
server.listen(5687);
