const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
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
  console.log("recieved token:- ", token);
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

module.exports = { signupUser, loginUser, checkUser };
