const Router = require("express");
const productroute = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const { authbuyer } = require("../middlewares/auth_buyer");
const { productmodel, cartmodel, ordermodel } = require("../databse/db");
require("dotenv").config();

productroute.post("/buy", authbuyer, async function (req, res) {
  const buyer_id = req.id;
  const { product_id, quantity } = req.body;
  try {
    const found = await productmodel.findOne({
      _id: product_id,
    });
    if (found) {
      const name = found.name;
      const price = found.price;
      const total = found.price * quantity;
      await ordermodel.create({
        name,
        price,
        total,
        quantity,
        buyer_id,
        product_id,
      });

      res.json({ msg: `Order Succesfull . Total amount paid ${total} rupees` });
    } else {
      res.json({ msg: "Item not found !" });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

productroute.post("/cart", authbuyer, async function (req, res) {
  const buyer_id = req.id;
  const { product_id, quantity } = req.body;
  try {
    const found = await productmodel.findOne({
      _id: product_id,
    });
    const price = found.price;
    const name = found.name;
    if (found) {
      total = price * quantity;
      await cartmodel.create({
        buyer_id,
        product_id,
        quantity,
        total,
        price: price,
        name: name,
      });
      res.json({ msg: "Item Added to Cart " });
    } else {
      res.json({ msg: "Item not found" });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = {
  productroute: productroute,
};
