const genarateMessage = (name, text) => {
  return {
    name,
    text,
    createdAt: new Date().getTime(),
  };
};

const genarateLocation = (name, url) => {
  return {
    name,
    url,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  genarateMessage,
  genarateLocation,
};
