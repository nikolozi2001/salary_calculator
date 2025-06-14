const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

const dataRoutes = require('./routes/data');
const activityRoutes = require('./routes/activity');
const isco08Routes = require('./routes/isco08');
const isco88Routes = require('./routes/isco88');


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'sallarium',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ message: 'Database connection successful!' });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ error: 'Failed to connect to database' });
  }
});

// Basic route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Salary Calculator API' });
});

// Routes
app.use('/api/data', dataRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/isco08', isco08Routes);
app.use('/api/isco88', isco88Routes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});