import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'sallarium',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get all ISCO08 professions
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM isco08');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching ISCO08 data:', error);
    res.status(500).json({ error: 'Failed to fetch ISCO08 data' });
  }
});

// Get ISCO08 profession by code
router.get('/code/:code', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM isco08 WHERE code = ?', [req.params.code]);
    connection.release();
    
    if (rows.length === 0) {
      res.status(404).json({ error: 'Profession not found' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error('Error fetching ISCO08 data by code:', error);
    res.status(500).json({ error: 'Failed to fetch ISCO08 data' });
  }
});

// Get statistics by gender
router.get('/statistics/gender', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT SUM(female) as totalFemale, SUM(male) as totalMale, SUM(total) as grandTotal FROM isco08'
    );
    connection.release();
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching ISCO08 gender statistics:', error);
    res.status(500).json({ error: 'Failed to fetch gender statistics' });
  }
});

// Search professions
router.get('/search', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM isco08 WHERE name LIKE ?',
      [`%${query}%`]
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error searching ISCO08 data:', error);
    res.status(500).json({ error: 'Failed to search ISCO08 data' });
  }
});

export default router;
