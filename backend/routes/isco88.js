const express = require('express');
const sql = require('mssql');
const dotenv = require('dotenv');
const { getConnection } = require('../config/connection');

dotenv.config();

const router = express.Router();

// Get all ISCO88 professions (with language support)
router.get("/", async (req, res) => {
  try {
    const { lang = "ge" } = req.query;
    const tableName = lang.toLowerCase() === "en" ? "isco1eng" : "isco1";

    const pool = await getConnection();
    const result = await pool.request()
      .query(`SELECT * FROM ${tableName}`);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching ISCO88 data:", error);
    res.status(500).json({ error: "Failed to fetch ISCO88 data" });
  }
});

// Get all second-level ISCO88 categories
router.get("/level2", async (req, res) => {
  try {
    const { lang = "ge" } = req.query;
    const tableName = lang.toLowerCase() === "en" ? "isco2eng" : "isco2";

    const pool = await getConnection();
    const result = await pool.request()
      .query(`SELECT * FROM ${tableName}`);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching ISCO88 level 2 data:", error);
    res.status(500).json({ error: "Failed to fetch ISCO88 level 2 data" });
  }
});

// Get second-level categories by parent code
router.get("/level2/parent/:code", async (req, res) => {
  try {
    const { lang = "ge" } = req.query;
    const tableName = lang.toLowerCase() === "en" ? "isco2eng" : "isco2";
    const parentCode = req.params.code;

    const pool = await getConnection();
    // Match first digit of level 2 code with parent code
    const result = await pool.request()
      .input('parentCodeStart', sql.Int, parentCode * 10)
      .input('parentCodeEnd', sql.Int, (parseInt(parentCode) + 1) * 10)
      .query(`SELECT * FROM ${tableName} WHERE code >= @parentCodeStart AND code < @parentCodeEnd`);
    
    const rows = result.recordset;
    if (rows.length === 0) {
      res.status(404).json({ error: "No subcategories found" });
    } else {
      res.json(rows);
    }
  } catch (error) {
    console.error("Error fetching ISCO88 level 2 data:", error);
    res.status(500).json({ error: "Failed to fetch ISCO88 level 2 data" });
  }
});

// Get ISCO88 profession by code
router.get("/code/:code", async (req, res) => {
  try {
    const { lang = "ge" } = req.query;
    const code = req.params.code;
    let tableName;

    // If code is 2 digits, it's a level 2 category
    if (code.length === 2) {
      tableName = lang.toLowerCase() === "en" ? "isco2eng" : "isco2";
    } else {
      tableName = lang.toLowerCase() === "en" ? "isco1eng" : "isco1";
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('code', sql.VarChar, code)
      .query(`SELECT * FROM ${tableName} WHERE code = @code`);
    
    const rows = result.recordset;
    if (rows.length === 0) {
      res.status(404).json({ error: "Profession not found" });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error("Error fetching ISCO88 data by code:", error);
    res.status(500).json({ error: "Failed to fetch ISCO88 data" });
  }
});

// Get statistics by gender
router.get("/statistics/gender", async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query("SELECT SUM(female) as totalFemale, SUM(male) as totalMale, SUM(total) as grandTotal FROM isco1");
    
    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error fetching ISCO88 gender statistics:", error);
    res.status(500).json({ error: "Failed to fetch gender statistics" });
  }
});

// Search professions
router.get("/search", async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('query', sql.VarChar, `%${query}%`)
      .query("SELECT * FROM isco1 WHERE name LIKE @query");
    
    res.json(result.recordset);
  } catch (error) {
    console.error("Error searching ISCO88 data:", error);
    res.status(500).json({ error: "Failed to search ISCO88 data" });
  }
});

module.exports = router;
