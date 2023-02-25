const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { genarateMessage, genarateLocation } = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

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

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit("welcomemessage", genarateMessage("Admin", "Welcome"));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        genarateMessage("Admin", `${user.username} has joined!`)
      );

    io.to(user.room).emit("roomdata", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  //sending messages to users in the same room
  socket.on("messageSend", (message, callback) => {
    const user = getUser(socket.id);

    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed!!");
    }

    io.to(user.room).emit("message", genarateMessage(user.username, message));
    callback();
  });

  //user disconnected message to individual users
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        genarateMessage("Admin", `${user.username} has left the chat!`)
      );
      io.to(user.room).emit("roomdata", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });

  //location sending to individual users
  socket.on("sendLocation", (location, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit(
      "locationdetails",
      genarateLocation(
        user.username,
        `https://google.com/maps?q=${location.latitude},${location.longitude}`
      )
    );
    callback();
  });
});

server.listen(port, () => {
  console.log(`Server is up and running on port ${port}!`);
});
