const { ValidationError } = require('../utils/customErrors');

// Validation middleware for product creation and update
exports.validateProduct = (req, res, next) => {
  const { name, description, price, category } = req.body;
  const errors = [];
  
  // Validate name
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }
  
  // Validate description
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push('Description is required and must be a non-empty string');
  }
  
  // Validate price
  if (price === undefined || price === null) {
    errors.push('Price is required');
  } else if (isNaN(price) || parseFloat(price) < 0) {
    errors.push('Price must be a valid positive number');
  }
  
  // Validate category
  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.push('Category is required and must be a non-empty string');
  }
  
  // Validate inStock (if provided)
  if (req.body.hasOwnProperty('inStock') && typeof req.body.inStock !== 'boolean') {
    errors.push('inStock must be a boolean value');
  }
  
  if (errors.length > 0) {
    throw new ValidationError('Validation failed', errors);
  }
  
  next();
};
