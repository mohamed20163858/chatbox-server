const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const PasswordResetToken = require("../models/PasswordResetToken");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const validator = require("validator");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const name = user.name;

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ name, email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup a user
const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.signup(name, email, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ name, email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const checkUser = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  // console.log("recieved token:- ", token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  try {
    // const decoded2 = jwt.decode(token, { complete: true });
    // console.log("Decoded JWT:", decoded2);
    // console.log(process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    const { app } = decoded;
    if (app !== "Next.js") {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    const { email } = req.body;
    const user = await User.findOne({ email }).select("-_id -__v");
    if (user && user.name && user.password) {
      const data = { ...user._doc };
      delete data.password;
      return res.json({ hasCredentials: true, ...data });
    }
    return res.json({ hasCredentials: false });
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

const getToken = async (req, res) => {
  const authToken = req.headers["authorization"]?.split(" ")[1];
  // console.log("recieved token:- ", authToken);
  if (!authToken) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  try {
    // const decoded2 = jwt.decode(token, { complete: true });
    // console.log("Decoded JWT:", decoded2);
    // console.log(process.env.JWT_SECRET);
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    // console.log(decoded);
    const { app } = decoded;
    if (app !== "Next.js") {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    const token = uuidv4();
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await PasswordResetToken.findOneAndDelete({ email });
    await PasswordResetToken.create({ email, token, expires });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: '"Chatbox" <admin@chatbox.com>',
      to: email,
      subject: "Password Reset Request",
      html: `
            <p>Click to reset your password:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>This link expires in 1 hour.</p>
          `,
    });

    res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const authToken = req.headers["authorization"]?.split(" ")[1];
  // console.log("recieved token:- ", authToken);
  if (!authToken) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  try {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    // console.log(decoded);
    const { app } = decoded;
    if (app !== "Next.js") {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    const { token, password } = req.body;
    if (!validator.isStrongPassword(password)) {
      throw Error(
        "Password not strong enough try to use combination of small and capital letters, numbers and special characters"
      );
    }

    // 1. 验证令牌
    const resetToken = await PasswordResetToken.findOne({ token });
    if (!resetToken || new Date() > resetToken.expires) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // 2. 更新用户密码
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      { email: resetToken.email },
      { password: hashedPassword }
    );

    await PasswordResetToken.deleteOne({ token });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser, checkUser, getToken, resetPassword };
