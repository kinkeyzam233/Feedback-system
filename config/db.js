 // db.js

const pgp = require('pg-promise')();
require('dotenv').config();

// Determine if the app is running in a production environment
const isProduction = process.env.NODE_ENV === 'production';

// Database connection config
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'feedback-system',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: isProduction
    ? { rejectUnauthorized: false }  // Use SSL in production (e.g., Render)
    : false                          // No SSL for local dev
};

// Initialize the connection
const db = pgp(dbConfig);

// Optional: Log connection success
db.connect()
  .then(obj => {
    console.log('✅ Database connected successfully');
    obj.done(); // release the connection
  })
  .catch(error => {
    console.error('❌ Database connection error:', error.message || error);
  });

module.exports = { db };
