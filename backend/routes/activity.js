const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

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

// GET all activities
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM activity ORDER BY orderby ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Error fetching activities' });
  }
});

// GET activity by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM activity WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ error: 'Error fetching activity' });
  }
});

module.exports = router;
