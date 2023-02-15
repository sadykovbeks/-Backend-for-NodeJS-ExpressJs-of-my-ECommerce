// --USER MODEL
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: Number,
});

module.exports = model("User", userSchema);
