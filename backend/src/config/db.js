/**
 * Database Connection Setup
 * Purpose: PostgreSQL connection pool and query interface
 * Owner: Member 3
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('error', (err) => {
  console.error('[PostgreSQL Pool Error]:', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  checkConnection: async () => {
    try {
      const res = await pool.query('SELECT NOW() as current_time');
      console.log('[PostgreSQL Connected]: Connected successfully at', res.rows[0].current_time);
      return true;
    } catch (err) {
      console.error('[PostgreSQL Connection Failed]:', err.message);
      return false;
    }
  }
};
