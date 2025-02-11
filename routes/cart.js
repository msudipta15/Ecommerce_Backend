const Router = require("express");
const cartroute = Router();
const { authbuyer } = require("../middlewares/auth_buyer");
const { productmodel, cartmodel } = require("../databse/db");
require("dotenv").config();

cartroute.get("/all", authbuyer, async function (req, res) {
  const buyer_id = req.id;
  try {
    const found = await cartmodel.find({
      buyer_id: buyer_id,
    });
    if (found != []) {
      res.json({ found });
    } else {
      res.json({ msg: "Cart is empty !" });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

cartroute.put("/delete", authbuyer, async function (req, res) {
  const buyer_id = req.id;
  const { product_id } = req.body;
  try {
    const found = await cartmodel.findOne({
      product_id: product_id,
      buyer_id: buyer_id,
    });
    if (found) {
      await cartmodel.deleteOne({
        product_id: product_id,
      });
    } else {
      res.json({ msg: "product not found" });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

cartroute.put("/edit", authbuyer, async function (req, res) {
  const buyer_id = req.id;
  const { product_id, quantity } = req.body;
  try {
    const product = await cartmodel.findOne({
      product_id: product_id,
    });
    const name = product.name;
    const price = product.price;
    const total = price * quantity;
    if (product) {
      await cartmodel.updateOne({
        name: name,
        buyer_id: buyer_id,
        product_id: product_id,
        price: price,
        quantity: quantity,
        total: total,
      });
      res.json({ msg: "Cart Updated" });
    } else {
      res.json({ msg: "Item not found !" });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

cartroute.get("/total", authbuyer, async function (req, res) {
  const buyer_id = req.id;
  try {
    const found = await cartmodel.find({
      buyer_id: buyer_id,
    });
    if (found != []) {
      let price = 0;
      found.forEach((e) => {
        price = price + e.total;
      });

      res.json({ msg: `Your Cart Total is ${price}` });
    } else {
      res.json({ msg: "Your Cart is empty !" });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = {
  cartroute: cartroute,
};
