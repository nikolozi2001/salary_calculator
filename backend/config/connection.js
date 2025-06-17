// TEMPORARY VERSION FOR TESTING - connection.js
const sql = require('mssql');

console.log('*** USING HARDCODED CONNECTION IN connection.js ***');

// Hardcode the values that work
const config = {
  server: '192.168.1.29',
  user: 'salarium',
  password: 'salarium123', // <-- REPLACE WITH YOUR PASSWORD
  database: 'salarium',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    port: 1433
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

pool.on('error', err => {
  console.error('SQL Server connection error:', err);
});

const getConnection = async () => {
  try {
    await poolConnect;
    console.log('Connection successful from connection.js');
    return pool;
  } catch (err) {
    console.error('Error getting connection from pool:', err);
    throw err;
  }
};

module.exports = {
  getConnection,
  pool,
  sql
};