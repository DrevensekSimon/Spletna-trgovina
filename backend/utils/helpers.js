/**
 * Helper utility functions for the sneaker shop backend
 */

/**
 * Calculate order total from items
 * @param {Array} items - Order items with price and quantity
 * @returns {number} Total amount
 */
const calculateOrderTotal = (items) => {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);
};

/**
 * Format date to ISO string
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
const formatDate = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    return new Date().toISOString();
  }
  return date.toISOString();
};

/**
 * Generate order reference number
 * @param {number} orderId - Order ID
 * @returns {string} Order reference
 */
const generateOrderReference = (orderId) => {
  const id = parseInt(orderId);
  if (isNaN(id) || id <= 0) return null;
  const timestamp = Date.now().toString(36).toUpperCase();
  return `ORD-${timestamp}-${id.toString().padStart(6, '0')}`;
};

/**
 * Paginate array results
 * @param {Array} items - Items to paginate
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {Object} Paginated result
 */
const paginate = (items, page = 1, limit = 10) => {
  if (!Array.isArray(items)) {
    return { data: [], page: 1, limit, total: 0, totalPages: 0 };
  }
  
  const numPage = Math.max(1, parseInt(page) || 1);
  const numLimit = Math.max(1, Math.min(100, parseInt(limit) || 10));
  const total = items.length;
  const totalPages = Math.ceil(total / numLimit);
  const startIndex = (numPage - 1) * numLimit;
  const data = items.slice(startIndex, startIndex + numLimit);
  
  return {
    data,
    page: numPage,
    limit: numLimit,
    total,
    totalPages,
  };
};

/**
 * Sanitize user input
 * @param {string} input - Input string
 * @returns {string} Sanitized string
 */
const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  return input.trim().replace(/[<>'"]/g, '');
};

/**
 * Check if stock is available
 * @param {number} requested - Requested quantity
 * @param {number} available - Available stock
 * @returns {boolean} True if stock is available
 */
const isStockAvailable = (requested, available) => {
  const req = parseInt(requested);
  const avail = parseInt(available);
  if (isNaN(req) || isNaN(avail)) return false;
  return req > 0 && avail >= req;
};

/**
 * Calculate shipping cost based on total
 * @param {number} orderTotal - Order total
 * @param {number} freeShippingThreshold - Threshold for free shipping
 * @param {number} shippingCost - Standard shipping cost
 * @returns {number} Shipping cost
 */
const calculateShipping = (orderTotal, freeShippingThreshold = 100, shippingCost = 5) => {
  const total = parseFloat(orderTotal) || 0;
  const threshold = parseFloat(freeShippingThreshold) || 100;
  const cost = parseFloat(shippingCost) || 5;
  return total >= threshold ? 0 : cost;
};

/**
 * Validate product data
 * @param {Object} product - Product object
 * @returns {Object} Validation result
 */
const validateProduct = (product) => {
  const errors = [];
  
  if (!product || typeof product !== 'object') {
    return { isValid: false, errors: ['Invalid product data'] };
  }
  
  if (!product.name || typeof product.name !== 'string' || product.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  if (typeof product.price !== 'number' || product.price < 0) {
    errors.push('Price must be a positive number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  calculateOrderTotal,
  formatDate,
  generateOrderReference,
  paginate,
  sanitizeInput,
  isStockAvailable,
  calculateShipping,
  validateProduct,
};
