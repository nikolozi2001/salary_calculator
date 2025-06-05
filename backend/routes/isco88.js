const express = require("express");
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

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

const router = express.Router();

// Get all ISCO88 professions (with language support)
router.get("/", async (req, res) => {
  try {
    const { lang = "ge" } = req.query;
    const tableName = lang.toLowerCase() === "en" ? "isco1eng" : "isco1";

    const connection = await pool.getConnection();
    const [rows] = await connection.query(`SELECT * FROM ${tableName}`);
    connection.release();
    res.json(rows);
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

    const connection = await pool.getConnection();
    const [rows] = await connection.query(`SELECT * FROM ${tableName}`);
    connection.release();
    res.json(rows);
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

    const connection = await pool.getConnection();
    // Match first digit of level 2 code with parent code
    const [rows] = await connection.query(
      `SELECT * FROM ${tableName} WHERE code >= ? AND code < ?`,
      [parentCode * 10, (parseInt(parentCode) + 1) * 10]
    );
    connection.release();

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

    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT * FROM ${tableName} WHERE code = ?`,
      [code]
    );
    connection.release();

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
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT SUM(female) as totalFemale, SUM(male) as totalMale, SUM(total) as grandTotal FROM isco1"
    );
    connection.release();
    res.json(rows[0]);
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
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT * FROM isco1 WHERE name LIKE ?",
      [`%${query}%`]
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error("Error searching ISCO88 data:", error);
    res.status(500).json({ error: "Failed to search ISCO88 data" });
  }
});

module.exports = router;
