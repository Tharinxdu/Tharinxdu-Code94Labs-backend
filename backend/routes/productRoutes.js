const express = require('express');
const router = express.Router();
const {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts // Import the searchProducts function
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware'); // Import the protect middleware

// Apply the `protect` middleware to all routes
router.use(protect);

// @route   GET /api/products/search
// @desc    Search products by query
// @access  Private (Protected)
router.get('/search', searchProducts);

// @route   POST /api/products
// @desc    Add a new product
// @access  Private (Protected)
router.post('/', addProduct);

// @route   GET /api/products
// @desc    Get all products
// @access  Private (Protected)
router.get('/', getProducts);

// @route   GET /api/products/:id
// @desc    Get a single product by ID
// @access  Private (Protected)
router.get('/:id', getProductById);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Protected)
router.put('/:id', updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (Protected)
router.delete('/:id', deleteProduct);

module.exports = router;
