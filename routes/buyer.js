const Router = require("express");
const buyerroute = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { z } = require("zod");
require("dotenv").config();
const { buyermodel, productmodel, ordermodel } = require("../databse/db");
const { authbuyer } = require("../middlewares/auth_buyer");

buyerroute.get("/allproducts", async function (req, res) {
  try {
    const products = await productmodel.find();
    if (products != []) {
      res.json({ products });
    } else {
      res.json({ msg: "No Products Available at this moment !" });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

buyerroute.post("/signup", async function (req, res) {
  const emailbody = z.object({
    email: z.string().min(3).max(100).email(),
  });
  const passwordbody = z.object({
    password: z.string().min(2).max(30),
  });
  const usernamebody = z.object({
    username: z.string().min(1).max(50),
  });
  const validemail = emailbody.safeParse(req.body);
  const validpassword = passwordbody.safeParse(req.body);
  const validusername = usernamebody.safeParse(req.body);

  if (!validemail.success) {
    res.json({ msg: "Please enter a valid email" });
    return;
  }
  if (!validpassword.success) {
    res.json({ msg: "password needs to be min 2 or max 30 characters long" });
    return;
  }
  if (!validusername.success) {
    res.json({ msg: "username should be min 1 or max 50" });
    return;
  }
  const { email, username, password } = req.body;
  const hashpassword = await bcrypt.hash(password, 10);

  try {
    const signup = await buyermodel.create({
      email,
      password: hashpassword,
      username,
    });
    if (signup) {
      res.status(200).json({ msg: "Signed Up !" });
    } else {
      res.status(401).json({ msg: "Error signing up !" });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

buyerroute.post("/signin", async function (req, res) {
  const { email, password } = req.body;
  try {
    const buyer = await buyermodel.findOne({ email: email });
    if (buyer) {
      const valid = await bcrypt.compare(password, buyer.password);
      if (valid) {
        const token = await jwt.sign(
          { id: buyer._id.toString() },
          process.env.jwt_key_buyer
        );
        res.json({ token: token });
      } else {
        res.json({ msg: "Incorrect Password !" });
      }
    } else {
      res.json({ msg: "Invalid email" });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

buyerroute.get("/orders", authbuyer, async function (req, res) {
  const buyer_id = req.id;
  const buyer = await ordermodel.find({
    buyer_id: buyer_id,
  });
  if (buyer != []) {
    res.json({ Orders: buyer });
  } else {
    res.json({ msg: "No Orders" });
  }
});

module.exports = {
  buyerroute: buyerroute,
};
