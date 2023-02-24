const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

io.on("connection", () => {
  console.log("New WebSocket Connection");
});

server.listen(port, () => {
  console.log(`Server is up and running on port ${port}!`);
});
