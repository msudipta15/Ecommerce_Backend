const Router = require("express");
const sellerroute = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const { sellermodel, productmodel } = require("../databse/db");
const { authseller } = require("../middlewares/auth_seller");
require("dotenv").config();

sellerroute.post("/signup", async function (req, res) {
  const emailbody = z.object({
    email: z.string().min(3).max(100).email(),
  });
  const passwordbody = z.object({
    password: z.string().min(2).max(30),
  });
  const validemail = emailbody.safeParse(req.body);
  const validpassword = passwordbody.safeParse(req.body);

  if (!validemail.success) {
    res.json({ msg: "Please enter a valid email" });
    return;
  }
  if (!validpassword.success) {
    res.json({ msg: "password needs to be min 2 or max 30 characters long" });
    return;
  }

  const { email, password } = req.body;
  const hashpassword = await bcrypt.hash(password, 10);

  try {
    const signup = await sellermodel.create({
      email,
      password: hashpassword,
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

sellerroute.post("/signin", async function (req, res) {
  const { email, password } = req.body;
  try {
    const seller = await sellermodel.findOne({ email: email });
    if (seller) {
      const valid = await bcrypt.compare(password, seller.password);
      if (valid) {
        const token = await jwt.sign(
          { id: seller._id.toString() },
          process.env.jwt_key_seller
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

sellerroute.post("/additem", authseller, async function (req, res) {
  const seller_id = req.id;
  const { name, price, description } = req.body;
  try {
    const item = await productmodel.create({
      name,
      description,
      price,
      seller_id: seller_id,
    });
    res.json({ msg: "item listed", item_id: item._id });
  } catch (error) {
    res.json({ error: error.message });
  }
});

sellerroute.put("/edititem", authseller, async function (req, res) {
  const seller_id = req.id;
  const { name, price, description, product_id } = req.body;
  try {
    const finditem = await productmodel.findOne({ _id: product_id });
    if (finditem) {
      if (seller_id !== finditem.seller_id.toString()) {
        res
          .status(403)
          .json({ msg: "You are not authorised to make changes !" });
        console.log(finditem.seller_id);
        console.log(seller_id);
      } else {
        await productmodel.updateOne({
          name,
          price,
          description,
          seller_id: seller_id,
        });
        res.json({ msg: "Product updated succesfully !" });
      }
    } else {
      res.json({ msg: "No product found !" });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

sellerroute.post("/deleteitem", authseller, async function (req, res) {
  const seller_id = req.id;
  const { product_id } = req.body;
  try {
    const finditem = await productmodel.findOne({
      _id: product_id,
    });
    if (finditem) {
      if (seller_id !== finditem.seller_id.toString()) {
        res
          .status(403)
          .json({ msg: "You are not authorised to make changes !" });
        console.log(finditem.seller_id);
        console.log(seller_id);
      } else {
        await productmodel.deleteOne({
          _id: product_id,
        });
        res.json({ msg: "Item deleted !" });
      }
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

sellerroute.get("/allitems", authseller, async function (req, res) {
  const seller_id = req.id;
  try {
    const items = await productmodel.find({
      seller_id: seller_id,
    });
    console.log(seller_id);

    if (items != []) {
      let allitems = [];
      items.forEach((item) => {
        allitems.push(item);
      });
      res.json({ allitems });
    } else {
      res.json({ msg: "No Items Found" });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = {
  sellerroute: sellerroute,
};
