const { Router } = require("express");
const cart = require("../models/cart");
const Cart = require("../models/cart");
const router = Router();

//CRUD
// Create = post
// Read = get
// Update = put
// Delete = delete

// All CRUD endrotts work successfully

//--Get Method
//Get the list of all products
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await Cart.find({ owner: userId }).populate("product");
    console.log(cart);
    res.json(cart);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
  }
});

//--Post Method
//Create new product
router.post("/", async (req, res) => {
  try {
    const { product, price, owner, quantity } = req.body;
    const newCartItem = new Cart({ product, price, owner, quantity });
    await newCartItem.save();
    res.status(201).json(newCartItem);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
  }
});

//-- Patch Method
// Update the specific product by ID
router.patch("/:cartItemId", async (req, res) => {
  try {
    const cartItemId = req.params.cartItemId;
    const { quantity } = req.body;
    const cartItem = await Cart.findById(cartItemId);

    if (!cartItem) {
      return res
        .status(404)
        .json({ message: "This product is not in the cart" });
    }

    Object.assign(cartItem, { quantity });
    await cartItem.save();
    return res.json(cartItem);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
  }
});

//--Delete Method
// Delete a specific product
router.delete("/:cartItemId", async (req, res) => {
  try {
    const cartItemId = req.params.cartItemId;
    const cartItem = await Cart.findById(cartItemId);

    if (!cartItem) {
      return res
        .status(404)
        .json({ message: "This product is not in the cart" });
    }
    await Cart.remove({ id: cartItemId });
    return res.json({ message: "Product successfully deleted from cart" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
