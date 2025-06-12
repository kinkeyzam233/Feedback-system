// db.js

const pgp = require('pg-promise')();
require('dotenv').config();

// Ensure all required environment variables are set
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

if (!DB_HOST || !DB_PORT || !DB_NAME || !DB_USER || !DB_PASSWORD) {
  throw new Error('❌ Missing one or more required database environment variables.');
}

// Database connection config (always use SSL on Render)
const dbConfig = {
  host: DB_HOST,
  port: Number(DB_PORT),
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
};

// Initialize the connection
const db = pgp(dbConfig);

// Optional: Log connection success/failure
db.connect()
  .then(obj => {
    console.log('✅ Database connected successfully');
    obj.done(); // release the connection
  })
  .catch(error => {
    console.error('❌ Database connection error:', error.message || error);
  });

module.exports = { db };
