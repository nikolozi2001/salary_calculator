const express = require('express');
const sql = require('mssql');
const dotenv = require('dotenv');
const { getConnection } = require('../config/connection');

dotenv.config();

const router = express.Router();

// GET all activities
router.get('/', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query('SELECT * FROM activity ORDER BY orderby ASC');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Error fetching activities' });
  }
});

// GET activity by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM activity WHERE id = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ error: 'Error fetching activity' });
  }
});

module.exports = router;
