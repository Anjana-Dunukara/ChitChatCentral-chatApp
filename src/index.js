const express = require("express");
const path = require("path");

const app = express();

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}!`);
});
