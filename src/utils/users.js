const users = [];

const addUser = ({ id, username, room }) => {
  //Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //Validate the data
  if (!username || !room) {
    return {
      error: "Username and room are required!",
    };
  }

  //Check for exsiting user
  const exsistingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  //Validate username
  if (exsistingUser) {
    return {
      error: "Username is in use!",
    };
  }

  //Store user
  const user = { id, username, room };
  users.push(user);
  return {
    user: user,
  };
};

//User remove function
const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id;
  });

  if (index != -1) {
    return users.splice(index, 1)[0];
  }
};

//Get user function
const getUser = (id) => {
  return users.find((user) => {
    return user.id === id;
  });
};

//Get users in a specifc room
const getUsersInRoom = (room) => {
  return users.filter((user) => {
    return user.room === room;
  });
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
