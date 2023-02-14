const {
  login,
  register,
  getProfile,
} = require("../controllers/auth.controller");

const authRouter = require("express").Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/profile", getProfile);

module.exports = authRouter;
