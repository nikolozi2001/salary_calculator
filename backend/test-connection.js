// test-connection.js - Run this directly to test SQL connection
const sql = require('mssql');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('Environment variables loaded:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'NOT SET');
console.log('DB_INSTANCE_NAME:', process.env.DB_INSTANCE_NAME || '(default)');
console.log('DB_PORT:', process.env.DB_PORT || '1433');

const testConnection = async () => {
  const config = {
    server: process.env.DB_HOST,
    database: process.env.DB_DATABASE || 'salarium',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      enableArithAbort: true,
      instanceName: process.env.DB_INSTANCE_NAME || undefined,
      port: parseInt(process.env.DB_PORT) || 1433,
      connectTimeout: 30000
    }
  };

  try {
    console.log('\nAttempting connection...');
    const pool = await sql.connect(config);
    console.log('✓ Connected successfully!');
    
    const result = await pool.request().query('SELECT @@VERSION as version, @@SERVERNAME as serverName');
    console.log('\n✓ Query executed successfully!');
    console.log('Server:', result.recordset[0].serverName);
    console.log('Version:', result.recordset[0].version.substring(0, 50) + '...');
    
    await pool.close();
    console.log('\n✓ Connection closed successfully!');
  } catch (err) {
    console.error('\n✗ Connection failed!');
    console.error('Error code:', err.code);
    console.error('Error message:', err.message);
    
    if (err.code === 'ESOCKET') {
      console.error('\nPossible causes:');
      console.error('- SQL Server is not running');
      console.error('- TCP/IP protocol is disabled in SQL Server');
      console.error('- Firewall is blocking port', config.options.port);
      console.error('- Wrong server address or port');
    } else if (err.code === 'ELOGIN') {
      console.error('\nAuthentication failed - check username and password');
    } else if (err.code === 'ETIMEOUT') {
      console.error('\nConnection timeout - server might be unreachable');
    }
  }
};

testConnection();