const { Router } = require("express");
const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const { db } = require("../models/user");
const router = Router();

// All CRUD endrotts work successfully

//--Get Method
// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select(["-password"]);
    return res.json(users);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
  }
});

//--Get Method
// Get specific user by ID
router.get("/:id", async (req, res) => {
  try {
    const candidate = await User.findById(req.params.id).select(["-password"]);
    if (!candidate) {
      return res
        .status(404)
        .json({ message: "User with such ID is not found" });
    }
    return res.json(candidate);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Failed while getting this user" });
  }
});

//--Patch Method
// Update the specific user by ID
router.patch("/:id", async (req, res) => {
  try {
    const updates = req.body;
    if (ObjectId.isValid(req.params.id)) {
      db.collection("users")
        .updateOne({ id: ObjectId(req.params.id) }, { $set: updates })
        .then(() => {
          res.status(200).json(updates);
        });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Could not update the product" });
  }
});

module.exports = router;
