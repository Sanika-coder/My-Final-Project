const express = require("express");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// =====================================================
// CREATE PRODUCT
// POST /api/products
// =====================================================
router.post("/", createProduct);

// =====================================================
// GET ALL PRODUCTS
// GET /api/products
// =====================================================
router.get("/", getProducts);

// =====================================================
// GET SINGLE PRODUCT
// GET /api/products/:id
// =====================================================
router.get("/:id", getProduct);

// =====================================================
// UPDATE PRODUCT
// PUT /api/products/:id
// =====================================================
router.put("/:id", updateProduct);

// =====================================================
// DELETE PRODUCT
// DELETE /api/products/:id
// =====================================================
router.delete("/:id", deleteProduct);

module.exports = router;