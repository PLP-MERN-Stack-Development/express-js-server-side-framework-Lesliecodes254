const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateApiKey } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');
const { asyncHandler } = require('../utils/asyncHandler');

// Apply authentication middleware to all routes
router.use(authenticateApiKey);

// GET /api/products - List all products (with filtering, pagination, search)
router.get('/', asyncHandler(productController.getAllProducts));

// GET /api/products/stats - Get product statistics
router.get('/stats', asyncHandler(productController.getProductStats));

// GET /api/products/search - Search products
router.get('/search', asyncHandler(productController.searchProducts));

// GET /api/products/:id - Get specific product
router.get('/:id', asyncHandler(productController.getProductById));

// POST /api/products - Create new product
router.post('/', validateProduct, asyncHandler(productController.createProduct));

// PUT /api/products/:id - Update product
router.put('/:id', validateProduct, asyncHandler(productController.updateProduct));

// DELETE /api/products/:id - Delete product
router.delete('/:id', asyncHandler(productController.deleteProduct));

module.exports = router;
