const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

module.exports = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'shopuser',
  password: process.env.DB_PASSWORD || 'shoppassword',
  database: process.env.DB_NAME || 'sneaker_shop',
};
