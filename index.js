const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 8000;
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
