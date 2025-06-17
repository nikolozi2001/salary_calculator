const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SQL Server configuration
const config = {
  server: process.env.DB_HOST,
  database: process.env.DB_DATABASE || "salarium",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    instanceName: process.env.DB_INSTANCE_NAME || "",
    port: parseInt(process.env.DB_PORT) || 1433,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

console.log("Database config:", {
  server: config.server,
  database: config.database,
  user: config.user,
  options: {
    ...config.options,
    instanceName: config.options.instanceName || "(default)",
  },
});

// Initialize SQL connection pool
let pool = null;

const initializePool = async () => {
  try {
    console.log("Attempting to connect to SQL Server...");
    pool = await sql.connect(config);
    console.log("Connected to SQL Server successfully");
    return true;
  } catch (err) {
    console.error("Failed to connect to SQL Server:", err);
    return false;
  }
};

// Route imports
const dataRoutes = require("./routes/data");
const activityRoutes = require("./routes/activity");
const isco08Routes = require("./routes/isco08");
const isco88Routes = require("./routes/isco88");
const diagnosticRoutes = require("./routes/diagnostic");

// Test database connection
app.get("/api/test-db", async (req, res) => {
  try {
    if (!pool || !pool.connected) {
      await initializePool();
    }
    const result = await pool.request().query("SELECT @@VERSION as version");
    res.json({
      message: "Database connection successful!",
      version: result.recordset[0].version,
      config: {
        server: config.server,
        database: config.database,
        user: config.user,
        options: {
          ...config.options,
          instanceName: config.options.instanceName || "(default)",
        },
      },
    });
  } catch (error) {
    console.error("Error in test-db:", error);
    res.status(500).json({
      error: "Failed to connect to database",
      details: error.message,
      code: error.code,
      config: {
        server: config.server,
        database: config.database,
        user: config.user,
        options: {
          ...config.options,
          instanceName: config.options.instanceName || "(default)",
        },
      },
    });
  }
});

// Basic route
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the Salary Calculator API" });
});

// Diagnostic route (no database connection required)
app.use("/api/diagnostic", diagnosticRoutes);

// Middleware to ensure database connection
app.use(async (req, res, next) => {
  try {
    if (!pool || !pool.connected) {
      await initializePool();
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Routes
app.use("/api/data", dataRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/isco08", isco08Routes);
app.use("/api/isco88", isco88Routes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    message: "Internal server error",
    status: 500,
    timestamp: new Date().toISOString(),
    path: req.path,
    details: err.message,
    code: err.code,
  });
});

// Start server
const port = process.env.PORT || process.env.IIS_NODE_PORT || 8000;

// Initialize connection and start server
initializePool().then((connected) => {
  if (connected) {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } else {
    console.error(
      "Failed to establish initial database connection. Server not started."
    );
    process.exit(1);
  }
});
