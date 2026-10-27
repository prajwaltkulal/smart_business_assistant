/**
 * Server Entry Point
 * Purpose: Start the HTTP server and load configuration
 * Owner: Member 2
 */

const app = require('./app');
const env = require('./src/config/env');
const db = require('./src/config/db');

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Smart Business Assistant Backend listening on port ${PORT}`);
  // Initialize db connection check placeholder
  db.checkConnection();
});
