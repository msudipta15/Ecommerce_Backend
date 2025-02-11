const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const buyer = new Schema({
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
});

const seller = new Schema({
  email: { type: String, unique: true },
  password: String,
});

const product = new Schema({
  name: String,
  price: Number,
  description: String,
  seller_id: ObjectId,
});

const order = new Schema({
  buyer_id: ObjectId,
  product_id: ObjectId,
  name: String,
  quantity: Number,
  price:Number,
  total: Number,
});

const cart = new Schema({
  buyer_id: ObjectId,
  product_id: ObjectId,
  quantity: Number,
  total: Number,
  price: Number,
  name: String,
});

const buyermodel = mongoose.model("buyer", buyer);
const sellermodel = mongoose.model("seller", seller);
const productmodel = mongoose.model("product", product);
const ordermodel = mongoose.model("order", order);
const cartmodel = mongoose.model("cart", cart);

module.exports = {
  buyermodel: buyermodel,
  sellermodel: sellermodel,
  productmodel: productmodel,
  ordermodel: ordermodel,
  cartmodel: cartmodel,
};
