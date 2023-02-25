const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { genarateMessage, genarateLocation } = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

//initilizing socket connection
io.on("connection", (socket) => {
  console.log("New WebSocket Connection");

  socket.on("join", ({ username, room }) => {
    socket.join(room);

    socket.broadcast
      .to(room)
      .emit("message", genarateMessage(`${username} has joined!`));
    socket.emit("welcomemessage", genarateMessage("Welcome"));
  });

  socket.on("messageSend", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed!!");
    }

    io.emit("message", genarateMessage(message));
    callback();
  });

  //user disconnected message to individual users
  socket.on("disconnect", () => {
    io.emit("message", genarateMessage("A User has left the chat..!!"));
  });

  //location sending to individual users
  socket.on("sendLocation", (location, callback) => {
    io.emit(
      "locationdetails",
      genarateLocation(
        `https://google.com/maps?q=${location.latitude},${location.longitude}`
      )
    );
    callback();
  });
});

server.listen(port, () => {
  console.log(`Server is up and running on port ${port}!`);
});
