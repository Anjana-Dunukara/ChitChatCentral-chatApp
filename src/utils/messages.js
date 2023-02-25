const genarateMessage = (text) => {
  return {
    text: text,
    createdAt: new Date().getTime(),
  };
};

const genarateLocation = (url) => {
  return {
    url: url,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  genarateMessage,
  genarateLocation,
};
