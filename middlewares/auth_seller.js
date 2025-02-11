const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_key = process.env.jwt_key_seller;



function auth_seller(req, res, next) {
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
  authseller: auth_seller,
};
