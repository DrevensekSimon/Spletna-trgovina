/**
 * Validation utility functions for the sneaker shop frontend
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Geslo je obvezno' };
  }
  if (password.length < 6) {
    return { isValid: false, message: 'Geslo mora imeti vsaj 6 znakov' };
  }
  if (password.length > 100) {
    return { isValid: false, message: 'Geslo je predolgo' };
  }
  return { isValid: true, message: '' };
};

/**
 * Validate name (first name or last name)
 * @param {string} name - Name to validate
 * @returns {boolean} True if valid name
 */
export const isValidName = (name) => {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 50;
};

/**
 * Validate postal code (Slovenian format)
 * @param {string} postalCode - Postal code to validate
 * @returns {boolean} True if valid postal code
 */
export const isValidPostalCode = (postalCode) => {
  if (!postalCode || typeof postalCode !== 'string') return false;
  const postalRegex = /^\d{4}$/;
  return postalRegex.test(postalCode.trim());
};

/**
 * Validate address
 * @param {string} address - Address to validate
 * @returns {boolean} True if valid address
 */
export const isValidAddress = (address) => {
  if (!address || typeof address !== 'string') return false;
  const trimmed = address.trim();
  return trimmed.length >= 5 && trimmed.length <= 200;
};

/**
 * Validate city name
 * @param {string} city - City to validate
 * @returns {boolean} True if valid city
 */
export const isValidCity = (city) => {
  if (!city || typeof city !== 'string') return false;
  const trimmed = city.trim();
  return trimmed.length >= 2 && trimmed.length <= 100;
};

/**
 * Validate shoe size
 * @param {string|number} size - Shoe size to validate
 * @returns {boolean} True if valid shoe size
 */
export const isValidShoeSize = (size) => {
  const numSize = parseFloat(size);
  if (isNaN(numSize)) return false;
  return numSize >= 35 && numSize <= 50 && (numSize % 0.5 === 0 || numSize % 1 === 0);
};

/**
 * Validate quantity
 * @param {number} quantity - Quantity to validate
 * @param {number} maxStock - Maximum stock available
 * @returns {boolean} True if valid quantity
 */
export const isValidQuantity = (quantity, maxStock = 99) => {
  const numQuantity = parseInt(quantity);
  if (isNaN(numQuantity)) return false;
  return numQuantity >= 1 && numQuantity <= maxStock;
};

/**
 * Sanitize string input
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};
