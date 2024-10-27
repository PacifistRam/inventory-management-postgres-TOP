require('dotenv').config();

const { Pool } = require("pg");

module.exports = new Pool({
    host: process.env.DB_HOST,
    user:process.env.DB_USER,
    database:process.env.DB_NAME,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT,

    max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Time in ms before an idle client is closed
  connectionTimeoutMillis: 2000, // Time in ms to wait for a connection to be established
})