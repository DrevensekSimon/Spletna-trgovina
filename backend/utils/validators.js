/**
 * Validation utility functions for the sneaker shop backend
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate password requirements
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required' };
  }
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters' };
  }
  if (password.length > 100) {
    return { isValid: false, message: 'Password is too long' };
  }
  return { isValid: true, message: '' };
};

/**
 * Validate user registration data
 * @param {Object} userData - User data object
 * @returns {Object} Validation result with errors array
 */
const validateUserRegistration = (userData) => {
  const errors = [];
  
  if (!userData || typeof userData !== 'object') {
    return { isValid: false, errors: ['Invalid user data'] };
  }
  
  if (!isValidEmail(userData.email)) {
    errors.push('Invalid email format');
  }
  
  const passwordValidation = validatePassword(userData.password);
  if (!passwordValidation.isValid) {
    errors.push(passwordValidation.message);
  }
  
  if (!userData.firstName || userData.firstName.trim().length < 2) {
    errors.push('First name must be at least 2 characters');
  }
  
  if (!userData.lastName || userData.lastName.trim().length < 2) {
    errors.push('Last name must be at least 2 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate order data
 * @param {Object} orderData - Order data
 * @returns {Object} Validation result
 */
const validateOrderData = (orderData) => {
  const errors = [];
  
  if (!orderData || typeof orderData !== 'object') {
    return { isValid: false, errors: ['Invalid order data'] };
  }
  
  if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
    errors.push('Order must contain at least one item');
  }
  
  if (!orderData.shippingAddress || orderData.shippingAddress.trim().length < 5) {
    errors.push('Valid shipping address is required');
  }
  
  if (!orderData.shippingCity || orderData.shippingCity.trim().length < 2) {
    errors.push('Valid shipping city is required');
  }
  
  if (!orderData.shippingPostalCode || !/^\d{4}$/.test(orderData.shippingPostalCode)) {
    errors.push('Valid postal code is required (4 digits)');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate product ID
 * @param {any} id - ID to validate
 * @returns {boolean} True if valid
 */
const isValidId = (id) => {
  const numId = parseInt(id);
  return !isNaN(numId) && numId > 0;
};

/**
 * Validate shoe size
 * @param {string|number} size - Size to validate
 * @returns {boolean} True if valid
 */
const isValidShoeSize = (size) => {
  const numSize = parseFloat(size);
  if (isNaN(numSize)) return false;
  return numSize >= 35 && numSize <= 50;
};

/**
 * Validate quantity
 * @param {number} quantity - Quantity to validate
 * @returns {boolean} True if valid
 */
const isValidQuantity = (quantity) => {
  const num = parseInt(quantity);
  return !isNaN(num) && num >= 1 && num <= 99;
};

module.exports = {
  isValidEmail,
  validatePassword,
  validateUserRegistration,
  validateOrderData,
  isValidId,
  isValidShoeSize,
  isValidQuantity,
};
