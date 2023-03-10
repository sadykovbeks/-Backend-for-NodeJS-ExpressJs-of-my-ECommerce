const { Schema, model } = require("mongoose");

const cartSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

module.exports = model("Cart", cartSchema);
