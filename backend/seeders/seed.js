const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'mysql',
    port: 3306,
    user: process.env.DB_USER || 'shopuser',
    password: process.env.DB_PASSWORD || 'shoppassword',
    database: process.env.DB_NAME || 'sneaker_shop'
  });

  try {
    // Generate proper hash for demo123
    const hashedPassword = await bcrypt.hash('demo123', 10);
    console.log('Generated hash for demo123:', hashedPassword);

    // Check if demo user exists
    const [existing] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      ['demo@example.com']
    );

    if (existing.length > 0) {
      // Update existing user's password
      await connection.query(
        'UPDATE users SET password = ?, city = ?, postal_code = ?, address = ? WHERE email = ?',
        [hashedPassword, 'Maribor', '2000', 'Glavna ulica 1', 'demo@example.com']
      );
      console.log('Demo user password updated!');
    } else {
      // Insert new demo user
      await connection.query(
        'INSERT INTO users (email, password, first_name, last_name, address, city, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['demo@example.com', hashedPassword, 'Demo', 'User', 'Glavna ulica 1', 'Maribor', '2000']
      );
      console.log('Demo user created!');
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await connection.end();
  }
}

seed();
