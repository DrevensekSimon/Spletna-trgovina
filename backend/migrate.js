const fs = require('fs/promises');
const path = require('path');
const mysql = require('mysql2/promise');
const database = require('./config/database');

async function migrate() {
  const connection = await mysql.createConnection({ ...database, multipleStatements: true });
  try {
    const schema = await fs.readFile(path.join(__dirname, 'init.sql'), 'utf8');
    await connection.query(schema);
    console.log('Shoe Shop database schema is ready.');
  } finally {
    await connection.end();
  }
}

migrate().catch(error => {
  console.error('Migration failed:', error.message);
  process.exitCode = 1;
});
