import express from "express";
import { pool } from "../config/connection.js";

const router = express.Router();

// Get all ISCO08 professions (with language support)
router.get("/", async (req, res) => {
  try {
    const { lang = "ge" } = req.query;
    const tableName = lang.toLowerCase() === "en" ? "isco08eng" : "isco08";

    const connection = await pool.getConnection();
    const [rows] = await connection.query(`SELECT * FROM ${tableName}`);
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error("Error fetching ISCO08 data:", error);
    res.status(500).json({ error: "Failed to fetch ISCO08 data" });
  }
});

// Get all second-level ISCO08 categories
router.get("/level2", async (req, res) => {
  try {
    const { lang = "ge" } = req.query;
    const tableName = lang.toLowerCase() === "en" ? "isco08_2eng" : "isco08_2";

    const connection = await pool.getConnection();
    const [rows] = await connection.query(`SELECT * FROM ${tableName}`);
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error("Error fetching ISCO08 level 2 data:", error);
    res.status(500).json({ error: "Failed to fetch ISCO08 level 2 data" });
  }
});

// Get second-level categories by parent code
router.get("/level2/parent/:code", async (req, res) => {
  try {
    const { lang = "ge" } = req.query;
    const tableName = lang.toLowerCase() === "en" ? "isco08_2eng" : "isco08_2";
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
    console.error("Error fetching ISCO08 level 2 data:", error);
    res.status(500).json({ error: "Failed to fetch ISCO08 level 2 data" });
  }
});

// Get ISCO08 profession by code
router.get("/code/:code", async (req, res) => {
  try {
    const { lang = "ge" } = req.query;
    const code = req.params.code;
    let tableName;

    // If code is 2 digits, it's a level 2 category
    if (code.length === 2) {
      tableName = lang.toLowerCase() === "en" ? "isco08_2eng" : "isco08_2";
    } else {
      tableName = lang.toLowerCase() === "en" ? "isco08eng" : "isco08";
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
    console.error("Error fetching ISCO08 data by code:", error);
    res.status(500).json({ error: "Failed to fetch ISCO08 data" });
  }
});

// Get statistics by gender
router.get("/statistics/gender", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT SUM(female) as totalFemale, SUM(male) as totalMale, SUM(total) as grandTotal FROM isco08"
    );
    connection.release();
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching ISCO08 gender statistics:", error);
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
      "SELECT * FROM isco08 WHERE name LIKE ?",
      [`%${query}%`]
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error("Error searching ISCO08 data:", error);
    res.status(500).json({ error: "Failed to search ISCO08 data" });
  }
});

export default router;
