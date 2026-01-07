import {
  calculateTotal,
  calculateItemCount,
  findCartItem,
  formatPrice,
  isValidCartItem,
  isCartEmpty,
  getUniqueProductCount,
  applyDiscount,
} from '../utils/cartUtils';
import { isValidEmail, validatePassword } from '../utils/validators';

describe('Frontend Tests', () => {
  // calculateTotal - pravilno izračuna skupno ceno
  test('1. calculateTotal should calculate total price correctly', () => {
    const items = [
      { productId: 1, price: 100, quantity: 2 },
      { productId: 2, price: 50, quantity: 1 },
    ];
    expect(calculateTotal(items)).toBe(250);
    expect(calculateTotal([])).toBe(0);
    expect(calculateTotal(null)).toBe(0);
  });

  // calculateItemCount - pravilno šteje izdelke
  test('2. calculateItemCount should count total items correctly', () => {
    const items = [{ quantity: 2 }, { quantity: 3 }, { quantity: 1 }];
    expect(calculateItemCount(items)).toBe(6);
    expect(calculateItemCount([])).toBe(0);
  });

  // findCartItem - najde izdelek v košarici
  test('3. findCartItem should find item by productId and size', () => {
    const items = [
      { productId: 1, size: '42', name: 'Sneaker A' },
      { productId: 2, size: '43', name: 'Sneaker B' },
    ];
    const found = findCartItem(items, 1, '42');
    expect(found).toBeDefined();
    expect(found.name).toBe('Sneaker A');
    expect(findCartItem(items, 99, '42')).toBeUndefined();
  });

  // formatPrice - pravilno formatira ceno
  test('4. formatPrice should format price in EUR', () => {
    const formatted = formatPrice(199.99);
    expect(formatted).toContain('199,99');
    expect(formatted).toContain('€');
  });

  // isValidCartItem - validira izdelek v košarici
  test('5. isValidCartItem should validate cart item correctly', () => {
    const validItem = {
      productId: 1,
      name: 'Air Jordan 1',
      price: 199.99,
      size: '42',
      quantity: 1,
    };
    expect(isValidCartItem(validItem)).toBe(true);
    expect(isValidCartItem(null)).toBe(false);
    expect(isValidCartItem({})).toBe(false);
  });

  // isCartEmpty - preveri če je košarica prazna
  test('6. isCartEmpty should check if cart is empty', () => {
    expect(isCartEmpty([])).toBe(true);
    expect(isCartEmpty([{ productId: 1 }])).toBe(false);
    expect(isCartEmpty(null)).toBe(true);
  });

  // getUniqueProductCount - šteje unikatne izdelke
  test('7. getUniqueProductCount should count unique products', () => {
    const items = [
      { productId: 1, size: '42' },
      { productId: 1, size: '43' },
      { productId: 2, size: '42' },
    ];
    expect(getUniqueProductCount(items)).toBe(2);
    expect(getUniqueProductCount([])).toBe(0);
  });

  // applyDiscount - pravilno izračuna popust
  test('8. applyDiscount should apply discount correctly', () => {
    expect(applyDiscount(100, 10)).toBe(90);
    expect(applyDiscount(100, 0)).toBe(100);
    expect(applyDiscount(100, 100)).toBe(0);
    expect(applyDiscount(100, -10)).toBe(100);
  });

  // isValidEmail - validira email
  test('9. isValidEmail should validate email format', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail(null)).toBe(false);
  });

  // validatePassword - validira geslo
  test('10. validatePassword should validate password strength', () => {
    expect(validatePassword('password123').isValid).toBe(true);
    expect(validatePassword('12345').isValid).toBe(false);
    expect(validatePassword('').isValid).toBe(false);
    expect(validatePassword(null).isValid).toBe(false);
  });
});
