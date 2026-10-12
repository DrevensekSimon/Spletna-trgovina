const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const database = require('../config/database');
const products = require('./products.json');

async function seed() {
  const connection = await mysql.createConnection(database);
  try {
    await connection.beginTransaction();
    const [categories] = await connection.query(
      'SELECT id FROM categories WHERE name = ? ORDER BY id LIMIT 1', ['Air Jordan 1']
    );
    let categoryId = categories[0]?.id;
    if (!categoryId) {
      const [result] = await connection.query(
        'INSERT INTO categories (name, description) VALUES (?, ?)',
        ['Air Jordan 1', 'Iconic Air Jordan 1 sneakers collection']
      );
      categoryId = result.insertId;
    }

    for (const product of products) {
      const [existing] = await connection.query(
        'SELECT id FROM products WHERE name = ? ORDER BY id LIMIT 1', [product.name]
      );
      let productId = existing[0]?.id;
      if (!productId) {
        const [result] = await connection.query(
          'INSERT INTO products (name, description, price, image_url, category_id, stock) VALUES (?, ?, ?, ?, ?, ?)',
          [product.name, product.description, product.price, product.image_url, categoryId, product.stock]
        );
        productId = result.insertId;
      }
      for (const { size, stock } of product.sizes) {
        await connection.query(
          `INSERT INTO product_sizes (product_id, size, stock)
           SELECT ?, ?, ? WHERE NOT EXISTS (
             SELECT 1 FROM product_sizes WHERE product_id = ? AND size = ?
           )`,
          [productId, size, stock, productId, size]
        );
      }
    }

    // Repair the original demo password hash, including on existing databases.
    const password = await bcrypt.hash('demo123', 10);
    await connection.query(
      `INSERT INTO users (email, password, first_name, last_name, address, city, postal_code)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE password = ?`,
      ['demo@example.com', password, 'Demo', 'User', 'Glavna ulica 1', 'Maribor', '2000', password]
    );
    await connection.commit();
    console.log('Shoe Shop demo data ready: 8 products, 64 sizes, demo@example.com / demo123.');
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

seed().catch(error => {
  console.error('Seeding failed:', error.message);
  process.exitCode = 1;
});
