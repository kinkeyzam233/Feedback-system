// src/config/db.js

const pgp = require('pg-promise')();
require('dotenv').config(); // Only useful for local dev

// Extract required DB environment variables
const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD
} = process.env;

// Check that all necessary env variables are present
if (!DB_HOST || !DB_PORT || !DB_NAME || !DB_USER || !DB_PASSWORD) {
  console.error('❌ Missing one or more required database environment variables:');
  console.error({
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD
  });
  throw new Error('❌ Cannot connect to database. One or more environment variables are missing.');
}

// Database config for Render (uses SSL)
const dbConfig = {
  host: DB_HOST,
  port: Number(DB_PORT),
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false // required for Render
  }
};

// Initialize and connect
const db = pgp(dbConfig);

// Test the connection
db.connect()
  .then(obj => {
    console.log('✅ Database connected successfully');
    obj.done(); // release the connection
  })
  .catch(error => {
    console.error('❌ Database connection error:', error.message || error);
  });

module.exports = { db };
