const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

const userRoutes = require("./routes/user");
// const cors = require("cors");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
app.use(bodyParser.json());
// app.use(
//   cors({
//     origin: "http://localhost:8000", // or your frontend URL
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
app.use(limiter);

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/user", userRoutes);

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const port = process.env.PORT || 8000;
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
