const express = require('express');
const sql = require('mssql');
const dotenv = require('dotenv');
const { getConnection } = require('../config/connection');

dotenv.config();

const router = express.Router();

// GET all data
router.get('/', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query('SELECT * FROM data');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// GET salary data by year and region
router.get('/:year/:region', async (req, res) => {
  try {
    const { year, region } = req.params;
    const pool = await getConnection();
    const result = await pool.request()
      .input('year', sql.Int, year)
      .input('region', sql.Int, region)
      .query('SELECT * FROM data WHERE year = @year AND region = @region');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'No data found for the specified year and region' });
    }
    
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching salary data:', error);
    res.status(500).json({ error: 'Error fetching salary data' });
  }
});

// GET specific salary data by year, region, and business sector
router.get('/:year/:region/:business', async (req, res) => {
  try {
    const { year, region, business } = req.params;
    const pool = await getConnection();
    const result = await pool.request()
      .input('year', sql.Int, year)
      .input('region', sql.Int, region)
      .input('business', sql.VarChar, business)
      .query('SELECT * FROM data WHERE year = @year AND region = @region AND business = @business');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'No data found for the specified parameters' });
    }
    
    res.json(result.recordset[0]); // Return the first matching record
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
    
    const pool = await getConnection();
    const result = await pool.request()
      .input('year', sql.Int, year)
      .input('region', sql.Int, resolvedRegion || "0")
      .input('business', sql.VarChar, resolvedBusiness || "AA")
      .query('SELECT total FROM data WHERE year = @year AND region = @region AND business = @business');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'No total salary data found for the specified parameters' });
    }
    
    res.json({ total: result.recordset[0].total });  } catch (error) {
    console.error('Error fetching total salary data:', error);
    res.status(500).json({ error: 'Error fetching total salary data' });
  }
});

// GET male or female salary by year, region, and business sector
router.get('/gender/:year/:region/:business/:gender', async (req, res) => {
  try {
    const { year, region, business, gender } = req.params;
    
    // Validate gender parameter
    if (gender !== 'male' && gender !== 'female') {
      return res.status(400).json({ error: 'Invalid gender parameter. Use "male" or "female".' });
    }
    
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
    
    const pool = await getConnection();
    const result = await pool.request()
      .input('year', sql.Int, year)
      .input('region', sql.Int, resolvedRegion || "0")
      .input('business', sql.VarChar, resolvedBusiness || "AA")
      .query(`SELECT ${gender} FROM data WHERE year = @year AND region = @region AND business = @business`);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: `No ${gender} salary data found for the specified parameters` });
    }

    res.json({ [gender]: result.recordset[0][gender] });
  } catch (error) {
    console.error('Error fetching gender-specific data:', error);
    res.status(500).json({ error: 'Error fetching gender-specific data' });
  }
});

module.exports = router;