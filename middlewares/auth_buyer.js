const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_key = process.env.jwt_key_buyer;

function auth_buyer(req, res, next) {
  const token = req.headers.token;
  const valid = jwt.verify(token, jwt_key);
  if (valid) {
    const id = valid.id;
    req.id = id;
    next();
  } else {
    res.json({ msg: "You are not signed in" });
  }
}

module.exports = {
  authbuyer: auth_buyer,
};
