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

// Get all ISCO08 English professions
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM isco08eng');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching ISCO08 English data:', error);
    res.status(500).json({ error: 'Failed to fetch ISCO08 English data' });
  }
});

// Get ISCO08 English profession by code
router.get('/code/:code', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM isco08eng WHERE code = ?', [req.params.code]);
    connection.release();
    
    if (rows.length === 0) {
      res.status(404).json({ error: 'Profession not found' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error('Error fetching ISCO08 English data by code:', error);
    res.status(500).json({ error: 'Failed to fetch ISCO08 English data' });
  }
});

export default router;
