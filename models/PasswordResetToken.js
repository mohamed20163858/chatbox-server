const mongoose = require("mongoose");
const resetTokenSchema = new mongoose.Schema({
  email: String,
  token: { type: String, unique: true },
  expires: Date,
});

module.exports = mongoose.model("PasswordResetToken", resetTokenSchema);
