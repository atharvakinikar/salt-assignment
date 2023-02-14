require("dotenv").config();
const jwt = require("jsonwebtoken");
const { sign, verify } = require("jsonwebtoken");

async function createToken(user) {
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.Secret
  );
  return token;
}

async function validateToken(token) {
  // const authHeader = req.headers["authorization"];
  // if (!authHeader)
  //   return res.status(400).json({ error: "User not Authenticated!" });

  // const token = authHeader.split(" ")[1];

  try {
    const verified = await jwt.verify(token, process.env.Secret);
    return verified.id;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
}

module.exports = { createToken, validateToken };
