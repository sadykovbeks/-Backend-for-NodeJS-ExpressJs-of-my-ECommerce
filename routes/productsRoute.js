const { Router } = require("express");
const Product = require("../models/product");
const { db } = require("../models/user");
const router = Router();
const { ObjectId } = require("mongodb");
const { body, validationResult } = require("express-validator");

//CRUD
// Create = post
// Read = get
// Update = put
// Delete = delete

// All CRUD endrotts work successfully

//--Post Method
//Create new product
router.post(
  "/",
  body("title")
    .trim()
    .isLength({ max: 50, min: 1 })
    .withMessage("Title must contain min 1 and max 50 characters "),
  body("description")
    .trim()
    .isLength({ max: 350, min: 1 })
    .withMessage("Description must contain min 1 and max 350 characters "),
  body("image")
    .notEmpty()
    .withMessage("This field is required")
    .isURL()
    .withMessage("Image must contain a URL "),
  body("price")
    .isNumeric()
    .withMessage("Price must be a Number")
    .notEmpty()
    .withMessage("This field is required "),
  body("owner")
    .notEmpty()
    .withMessage("This field is required and owner must have an ID"),
  async (req, res) => {
    try {
      const { title, price, description, owner, image } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({ errors: errors.array() });
      }

      const product = new Product({ title, price, description, owner, image });

      await product.save();
      res.status(201).json(product);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

//--Get Method
// Get the list of all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("owner");
    // const products = await Product.find().populate([ { path: 'orderItems.product', model: 'productSchema', populate: [ { path: 'user', model: 'User', select: 'name', }, ], }, ]);
    return res.json(products);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

//--Get Method
// Get a specific product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(ObjectId(req.params.id));
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product with such ID is not found" });
    }
    return res.json(product);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

//-- Patch Method
// Update the specific product by ID
router.patch(
  "/:id",
  body("title")
    .trim()
    .isLength({ max: 50, min: 1 })
    .withMessage("Title must contain min 1 and max 50 characters "),
  body("description")
    .trim()
    .isLength({ max: 350, min: 1 })
    .withMessage("Description must contain min 1 and max 350 characters "),
  body("image")
    .notEmpty()
    .withMessage("This field is required")
    .isURL()
    .withMessage("Image must contain a URL "),
  body("price")
    .isNumeric()
    .withMessage("Price must be a Number")
    .notEmpty()
    .withMessage("This field is required "),
  body("owner")
    .notEmpty()
    .withMessage("This field is required and owner must have an ID"),
  async (req, res) => {
    try {
      const { title, description, image, price, owner } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({ errors: errors.array() });
      }

      const candidate = await Product.findById(req.params.id);
      if (!candidate) {
        return res.status(404).json({ message: "Продукт не найден" });
      }

      if (owner !== candidate.owner.toString()) {
        return res
          .status(400)
          .json({ message: "Вы не можете отредактировать чужой товар" });
      }

      Object.assign(candidate, {
        title,
        description,
        image,
        price,
      });
      await candidate.save();
      return res.json(candidate);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Could not update the product" });
    }
  }
);

//--Delete Method
// Delete a specific product
router.delete("/:id", (req, res) => {
  try {
    const product = req.body;
    db.collection("products")
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json({ message: "product successfully deleted" });
      });
  } catch (e) {
    res.status(500).json({ message: "Could not delete the product" });
  }
});

module.exports = router;
