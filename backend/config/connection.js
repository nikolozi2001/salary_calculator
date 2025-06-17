// connection.js
const sql = require('mssql');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connection configuration
const config = {
  server: process.env.DB_HOST || '192.168.1.29',
  user: process.env.DB_USER || 'salarium',
  password: process.env.DB_PASSWORD || 'salarium123',
  database: process.env.DB_DATABASE || 'salarium',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    port: parseInt(process.env.DB_PORT) || 1433,
    connectTimeout: 30000, // 30 seconds
    requestTimeout: 30000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 30000
  }
};

// Create connection pool
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

// Connection status tracking
let connectionStatus = {
  isConnected: false,
  lastError: null,
  lastConnectTime: null,
  reconnectAttempts: 0,
  maxReconnectAttempts: 3
};

// Connection error handler
pool.on('error', err => {
  console.error('SQL Server connection error:', err);
  connectionStatus.isConnected = false;
  connectionStatus.lastError = err;

  if (err.code === 'ECONNRESET' || err.code === 'ETIMEOUT') {
    console.log('Connection lost. Attempting to reconnect...');
    reconnect();
  }
});

// Reconnection function with exponential backoff
async function reconnect(retryCount = 0) {
  const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 30000); // Max 30 seconds

  try {
    if (pool.connected) {
      await pool.close();
    }

    console.log(`Reconnection attempt ${retryCount + 1}/${connectionStatus.maxReconnectAttempts}`);
    await poolConnect;

    connectionStatus.isConnected = true;
    connectionStatus.lastConnectTime = new Date();
    connectionStatus.lastError = null;
    connectionStatus.reconnectAttempts = 0;

    console.log('Reconnection successful');
  } catch (err) {
    connectionStatus.lastError = err;
    connectionStatus.reconnectAttempts++;

    if (retryCount < connectionStatus.maxReconnectAttempts) {
      console.log(`Retrying in ${backoffTime/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
      return reconnect(retryCount + 1);
    } else {
      console.error('Max retry attempts reached');
      throw err;
    }
  }
}

// Get connection function with advanced status check
const getConnection = async () => {
  try {
    if (!pool.connected) {
      console.log('Pool not connected. Connecting...');
      await poolConnect;
      connectionStatus.isConnected = true;
      connectionStatus.lastConnectTime = new Date();
    }
    
    // Validate connection with a lightweight query
    await pool.request().query('SELECT @@SPID as spid');
    return pool;
  } catch (err) {
    connectionStatus.isConnected = false;
    connectionStatus.lastError = err;

    if (err.code === 'ECONNRESET' || err.code === 'ELOGIN' || err.code === 'ETIMEOUT') {
      return reconnect();
    }
    throw err;
  }
};

// Enhanced connection status check
const checkConnection = async () => {
  try {
    const connection = await getConnection();
    const result = await connection.request().query(`
      SELECT 
        @@VERSION as version,
        @@SPID as spid,
        SYSDATETIME() as serverTime,
        DB_NAME() as currentDatabase
    `);

    return {
      connected: true,
      version: result.recordset[0].version,
      spid: result.recordset[0].spid,
      serverTime: result.recordset[0].serverTime,
      currentDatabase: result.recordset[0].currentDatabase,
      status: connectionStatus,
      config: {
        server: config.server,
        database: config.database,
        user: config.user,
        port: config.options.port
      }
    };
  } catch (err) {
    return {
      connected: false,
      error: err.message,
      code: err.code,
      status: connectionStatus,
      config: {
        server: config.server,
        database: config.database,
        user: config.user,
        port: config.options.port
      }
    };
  }
};

module.exports = { getConnection, checkConnection };