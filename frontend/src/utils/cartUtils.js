/**
 * Cart utility functions for the sneaker shop
 */

/**
 * Calculate total price of cart items
 * @param {Array} items - Cart items array
 * @returns {number} Total price
 */
export const calculateTotal = (items) => {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);
};

/**
 * Calculate total item count in cart
 * @param {Array} items - Cart items array
 * @returns {number} Total item count
 */
export const calculateItemCount = (items) => {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
};

/**
 * Find item in cart by productId and size
 * @param {Array} items - Cart items array
 * @param {number} productId - Product ID
 * @param {string} size - Size
 * @returns {Object|undefined} Found item or undefined
 */
export const findCartItem = (items, productId, size) => {
  if (!Array.isArray(items)) return undefined;
  return items.find((item) => item.productId === productId && item.size === size);
};

/**
 * Format price to currency string
 * @param {number} price - Price value
 * @param {string} currency - Currency code (default: EUR)
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = 'EUR') => {
  const numPrice = parseFloat(price) || 0;
  return new Intl.NumberFormat('sl-SI', {
    style: 'currency',
    currency: currency,
  }).format(numPrice);
};

/**
 * Validate cart item
 * @param {Object} item - Cart item to validate
 * @returns {boolean} True if valid
 */
export const isValidCartItem = (item) => {
  if (!item || typeof item !== 'object') return false;
  return (
    typeof item.productId === 'number' &&
    item.productId > 0 &&
    typeof item.name === 'string' &&
    item.name.length > 0 &&
    typeof item.price === 'number' &&
    item.price >= 0 &&
    typeof item.size === 'string' &&
    item.size.length > 0 &&
    typeof item.quantity === 'number' &&
    item.quantity > 0
  );
};

/**
 * Check if cart is empty
 * @param {Array} items - Cart items array
 * @returns {boolean} True if cart is empty
 */
export const isCartEmpty = (items) => {
  if (!Array.isArray(items)) return true;
  return items.length === 0;
};

/**
 * Get unique product count (ignoring sizes)
 * @param {Array} items - Cart items array
 * @returns {number} Unique product count
 */
export const getUniqueProductCount = (items) => {
  if (!Array.isArray(items)) return 0;
  const uniqueIds = new Set(items.map((item) => item.productId));
  return uniqueIds.size;
};

/**
 * Calculate discount
 * @param {number} total - Total price
 * @param {number} discountPercent - Discount percentage (0-100)
 * @returns {number} Discounted price
 */
export const applyDiscount = (total, discountPercent) => {
  const numTotal = parseFloat(total) || 0;
  const numDiscount = parseFloat(discountPercent) || 0;
  if (numDiscount < 0 || numDiscount > 100) return numTotal;
  return numTotal * (1 - numDiscount / 100);
};
