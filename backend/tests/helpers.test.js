const {
  calculateOrderTotal,
  formatDate,
  generateOrderReference,
  paginate,
  sanitizeInput,
  isStockAvailable,
  calculateShipping,
  validateProduct,
} = require('../utils/helpers');
const { isValidEmail, validateUserRegistration } = require('../utils/validators');

describe('Backend Tests', () => {
  // Test 1: calculateOrderTotal - izračuna skupno ceno naročila
  test('1. calculateOrderTotal should calculate order total correctly', () => {
    const items = [
      { price: 100, quantity: 2 },
      { price: 50, quantity: 1 },
    ];
    expect(calculateOrderTotal(items)).toBe(250);
    expect(calculateOrderTotal([])).toBe(0);
    expect(calculateOrderTotal(null)).toBe(0);
  });

  // Test 2: formatDate - formatira datum
  test('2. formatDate should format date to ISO string', () => {
    const date = new Date('2024-01-15T10:30:00Z');
    expect(formatDate(date)).toBe('2024-01-15T10:30:00.000Z');
    expect(formatDate('invalid')).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  // Test 3: generateOrderReference - generira referenco naročila
  test('3. generateOrderReference should generate valid order reference', () => {
    const ref = generateOrderReference(123);
    expect(ref).toMatch(/^ORD-[A-Z0-9]+-000123$/);
    expect(generateOrderReference(-1)).toBeNull();
    expect(generateOrderReference(0)).toBeNull();
  });

  // Test 4: paginate - paginira rezultate
  test('4. paginate should paginate results correctly', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = paginate(items, 1, 3);
    expect(result.data).toEqual([1, 2, 3]);
    expect(result.totalPages).toBe(4);
    expect(paginate([], 1, 10).total).toBe(0);
  });

  // Test 5: sanitizeInput - očisti uporabniški vnos
  test('5. sanitizeInput should remove dangerous characters', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert(xss)/script');
    expect(sanitizeInput('  hello world  ')).toBe('hello world');
    expect(sanitizeInput(null)).toBe('');
  });

  // Test 6: isStockAvailable - preveri razpoložljivost zaloge
  test('6. isStockAvailable should check stock availability', () => {
    expect(isStockAvailable(2, 5)).toBe(true);
    expect(isStockAvailable(10, 5)).toBe(false);
    expect(isStockAvailable(-1, 5)).toBe(false);
  });

  // Test 7: calculateShipping - izračuna stroške pošiljanja
  test('7. calculateShipping should calculate shipping cost', () => {
    expect(calculateShipping(150, 100, 5)).toBe(0);
    expect(calculateShipping(50, 100, 5)).toBe(5);
    expect(calculateShipping(50)).toBe(5);
  });

  // Test 8: validateProduct - validira podatke o izdelku
  test('8. validateProduct should validate product data', () => {
    const validProduct = { name: 'Air Jordan 1', price: 199.99 };
    expect(validateProduct(validProduct).isValid).toBe(true);
    expect(validateProduct({ name: 'A', price: -10 }).isValid).toBe(false);
    expect(validateProduct(null).isValid).toBe(false);
  });

  // Test 9: isValidEmail - validira email
  test('9. isValidEmail should validate email format', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail(null)).toBe(false);
  });

  // Test 10: validateUserRegistration - validira registracijo
  test('10. validateUserRegistration should validate user registration data', () => {
    const validUser = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };
    expect(validateUserRegistration(validUser).isValid).toBe(true);
    expect(validateUserRegistration({ email: 'invalid', password: '123', firstName: 'J', lastName: '' }).isValid).toBe(false);
    expect(validateUserRegistration(null).isValid).toBe(false);
  });
});
