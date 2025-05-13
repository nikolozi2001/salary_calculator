import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

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

// GET all data
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sallarium.data');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});


// GET salary data by year and region
router.get('/:year/:region', async (req, res) => {
  try {
    const { year, region } = req.params;
    
    const [rows] = await pool.query(
      'SELECT * FROM sallarium.data WHERE YEAR = ? AND region = ?', 
      [year, region]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No data found for the specified year and region' });
    }
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching salary data:', error);
    res.status(500).json({ error: 'Error fetching salary data' });
  }
});

// GET specific salary data by year, region, and business sector
router.get('/:year/:region/:business', async (req, res) => {
  try {
    const { year, region, business } = req.params;
    
    const [rows] = await pool.query(
      'SELECT * FROM sallarium.data WHERE YEAR = ? AND region = ? AND business = ?', 
      [year, region, business]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No data found for the specified parameters' });
    }
    
    res.json(rows[0]); // Return the first matching record
  } catch (error) {
    console.error('Error fetching specific salary data:', error);
    res.status(500).json({ error: 'Error fetching specific salary data' });
  }
});

// GET total salary by year, region, and business sector
router.get('/total/:year/:region/:business', async (req, res) => {
  try {
    const { year, region, business } = req.params;
      // Handle default values on the server side as well, for robustness
    let resolvedRegion = region;
    let resolvedBusiness = business;
      // If only year is provided (region and business are missing or empty strings)
    if (year && (!region || region === '') && (!business || business === '')) {
      resolvedRegion = "0"; // Default to Georgia (All)
      resolvedBusiness = "AA"; // Default to All Activities
    }
    // If year and region are provided but business is missing
    else if (year && region && (!business || business === '')) {
      resolvedBusiness = "AA"; // Default to All Activities
    }
    // If year and business are provided but region is missing
    else if (year && (!region || region === '') && business) {
      resolvedRegion = "0"; // Default to Georgia (All)
    }
    
    const [rows] = await pool.query(
      'SELECT total FROM sallarium.data WHERE YEAR = ? AND region = ? AND business = ?', 
      [year, resolvedRegion || "0", resolvedBusiness || "AA"]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No total salary data found for the specified parameters' });
    }
    
    res.json({ total: rows[0].total });
  } catch (error) {
    console.error('Error fetching total salary data:', error);
    res.status(500).json({ error: 'Error fetching total salary data' });
  }
});

export default router;