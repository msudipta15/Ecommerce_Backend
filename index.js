const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const { buyerroute } = require("./routes/buyer");
const { sellerroute } = require("./routes/seller");
const { productroute } = require("./routes/product");
const { cartroute } = require("./routes/cart");

async function main() {
  await mongoose
    .connect(process.env.mongodb_url)
    .then(() => {
      console.log("connected");
    })
    .catch((err) => {
      console.log("Connection Unsuccesfull !", err);
    });
  app.listen(process.env.port);
}
main();
app.use(express.json());

app.use("/buyer", buyerroute);
app.use("/seller", sellerroute);
app.use("/product", productroute);
app.use("/cart", cartroute);
