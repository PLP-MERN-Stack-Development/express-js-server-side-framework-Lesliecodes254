const { v4: uuidv4 } = require('uuid');
const { NotFoundError, ValidationError } = require('../utils/customErrors');

// In-memory database (replace with real database in production)
let products = [
  {
    id: uuidv4(),
    name: 'Laptop',
    description: 'High-performance laptop',
    price: 999.99,
    category: 'Electronics',
    inStock: true
  },
  {
    id: uuidv4(),
    name: 'Coffee Maker',
    description: 'Automatic coffee maker',
    price: 79.99,
    category: 'Appliances',
    inStock: true
  },
  {
    id: uuidv4(),
    name: 'Desk Chair',
    description: 'Ergonomic office chair',
    price: 249.99,
    category: 'Furniture',
    inStock: false
  }
];

// GET all products with filtering, pagination, and sorting
exports.getAllProducts = (req, res) => {
  let filteredProducts = [...products];
  
  // Filter by category
  if (req.query.category) {
    filteredProducts = filteredProducts.filter(
      p => p.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }
  
  // Filter by stock status
  if (req.query.inStock !== undefined) {
    const inStock = req.query.inStock === 'true';
    filteredProducts = filteredProducts.filter(p => p.inStock === inStock);
  }
  
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    count: paginatedProducts.length,
    total: filteredProducts.length,
    page,
    totalPages: Math.ceil(filteredProducts.length / limit),
    data: paginatedProducts
  });
};

// GET product by ID
exports.getProductById = (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  
  if (!product) {
    throw new NotFoundError(`Product with ID ${req.params.id} not found`);
  }
  
  res.json({
    success: true,
    data: product
  });
};

// POST create new product
exports.createProduct = (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  
  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price: parseFloat(price),
    category,
    inStock: inStock !== undefined ? inStock : true
  };
  
  products.push(newProduct);
  
  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: newProduct
  });
};

// PUT update product
exports.updateProduct = (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  
  if (productIndex === -1) {
    throw new NotFoundError(`Product with ID ${req.params.id} not found`);
  }
  
  const { name, description, price, category, inStock } = req.body;
  
  products[productIndex] = {
    ...products[productIndex],
    name: name || products[productIndex].name,
    description: description || products[productIndex].description,
    price: price !== undefined ? parseFloat(price) : products[productIndex].price,
    category: category || products[productIndex].category,
    inStock: inStock !== undefined ? inStock : products[productIndex].inStock
  };
  
  res.json({
    success: true,
    message: 'Product updated successfully',
    data: products[productIndex]
  });
};

// DELETE product
exports.deleteProduct = (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  
  if (productIndex === -1) {
    throw new NotFoundError(`Product with ID ${req.params.id} not found`);
  }
  
  const deletedProduct = products.splice(productIndex, 1)[0];
  
  res.json({
    success: true,
    message: 'Product deleted successfully',
    data: deletedProduct
  });
};

// GET search products
exports.searchProducts = (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    throw new ValidationError('Search query parameter "q" is required');
  }
  
  const searchResults = products.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.description.toLowerCase().includes(q.toLowerCase())
  );
  
  res.json({
    success: true,
    count: searchResults.length,
    query: q,
    data: searchResults
  });
};

// GET product statistics
exports.getProductStats = (req, res) => {
  const stats = {
    totalProducts: products.length,
    inStock: products.filter(p => p.inStock).length,
    outOfStock: products.filter(p => !p.inStock).length,
    byCategory: {},
    averagePrice: 0
  };
  
  // Count by category
  products.forEach(p => {
    if (!stats.byCategory[p.category]) {
      stats.byCategory[p.category] = 0;
    }
    stats.byCategory[p.category]++;
  });
  
  // Calculate average price
  if (products.length > 0) {
    const totalPrice = products.reduce((sum, p) => sum + p.price, 0);
    stats.averagePrice = (totalPrice / products.length).toFixed(2);
  }
  
  res.json({
    success: true,
    data: stats
  });
};
