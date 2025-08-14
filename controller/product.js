const Product = require("../models/product");

// Get all products
async function getAllProducts(req, res) {
  try {
    const products = await Product.find(); // Fetch all products from DB
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
}

// Create a new product
async function createProduct(req, res) {
  try {
    const { name, price, description, imageUrl, category } = req.body;

    // Validate input (optional, could add more checks)
    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const newProduct = new Product({
      name,
      price,
      description,
      imageUrl,
      category,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: savedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
}

module.exports = {
  getAllProducts,
  createProduct,
};
