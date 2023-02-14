require("dotenv").config();
const { createToken, validateToken } = require("../middlewares/jwt");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const {
  HttpApiResponse,
  HandleError,
  HttpErrorResponse,
} = require("../utils/utils");

// Login route
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).lean();

    if (!user) return res.send(HttpErrorResponse("User not found"));

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = await createToken(user);
      var user_details = { token: token };
      return res.send(HttpApiResponse(user_details));
    }
    return res.send(HttpErrorResponse("Invalid Password"));
  } catch (err) {
    await HandleError("Auth", "login", err);
    return res.send(HttpErrorResponse(err));
  }
}

async function register(req, res) {
  const { email, password, name } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) return res.send(HttpErrorResponse("User already exists"));
    const hashedPassword = await bcrypt.hash(password, 10);

    var newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    return res.send(HttpApiResponse("Registration successful!"));
  } catch (error) {
    await HandleError("Auth", "register", error);
    return res.send(HttpErrorResponse(error.message));
  }
}

//
async function getProfile(req, res) {
  //   const { email } = req.body;
  // const authHeader = req.headers["authorization"];
  // if (!authHeader)
  //   return res.status(400).json({ error: "User not Authenticated!" });

  // const token = authHeader.split(" ")[1];
  // const email = validateToken(token);

  const { token } = req.body;
  const id = await validateToken(token);
  console.log(id);
  try {
    // Find user without sending password and version key (__v)
    // console.log("[Auth] Get by user-id: " + req.user.id);
    const user = await User.findById(id).lean();
    if (user) {
      return res.send(HttpApiResponse(user.name));
    } else {
      return res.send(HttpErrorResponse("No user exists with such id"));
    }
  } catch (err) {
    HandleError("Auth", "getProfile", err);
    return res.send(HttpErrorResponse(err.message));
  }
}

module.exports = { login, register, getProfile };
