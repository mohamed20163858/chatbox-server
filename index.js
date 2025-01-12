const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, // Only if you want to handle credentials-based login
});

const User = mongoose.model("User", userSchema);
// Express Routes for custom API endpoints
app.post("/api/auth/credentials-login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && user.password === password) {
    return res.json({ id: user._id, name: user.name, email: user.email });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});
const port = process.env.PORT || 8000;
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
