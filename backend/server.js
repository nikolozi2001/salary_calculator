const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { getConnection, checkConnection } = require("./config/connection");
const { apiLimiter, diagnosticLimiter } = require("./middleware/rateLimiter");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all routes
app.use('/api/', apiLimiter);

// Route imports
const dataRoutes = require("./routes/data");
const activityRoutes = require("./routes/activity");
const isco08Routes = require("./routes/isco08");
const isco88Routes = require("./routes/isco88");
const diagnosticRoutes = require("./routes/diagnostic");

// Test database connection
app.get("/api/test-db", diagnosticLimiter, async (req, res) => {
  try {
    const status = await checkConnection();
    if (status.connected) {
      res.json({
        message: "Database connection successful!",
        ...status,
      });
    } else {
      res.status(500).json({
        error: "Failed to connect to database",
        ...status,
      });
    }
  } catch (error) {
    console.error("Error in test-db:", error);
    res.status(500).json({
      error: "Failed to connect to database",
      details: error.message,
      code: error.code,
    });
  }
});

// Basic route
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the Salary Calculator API" });
});

// Diagnostic route (no database connection required)
app.use("/api/diagnostic", diagnosticLimiter, diagnosticRoutes);

// Middleware to ensure database connection
app.use(async (req, res, next) => {
  try {
    await getConnection();
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

// Global error handler with detailed error information
app.use((err, req, res, next) => {
  console.error("Error:", err);
  
  // Determine if this is a SQL Server error
  const isSqlError = err.class === 'SqlError' || err.code?.startsWith('ESQL');
  
  const errorResponse = {
    message: "Internal server error",
    status: err.status || 500,
    timestamp: new Date().toISOString(),
    path: req.path,
    details: err.message,
    code: err.code,
    type: isSqlError ? 'database' : 'server'
  };

  // Add extra details for SQL Server errors
  if (isSqlError) {
    errorResponse.sqlState = err.state;
    errorResponse.procedure = err.procName;
    errorResponse.lineNumber = err.lineNumber;
  }

  res.status(errorResponse.status).json(errorResponse);
});

// Start server
const port = process.env.PORT || process.env.IIS_NODE_PORT || 8000;

// Initialize connection and start server
checkConnection().then((status) => {
  if (status.connected) {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log("Database connection verified");
      console.log(`Database: ${status.currentDatabase}`);
      console.log(`SQL Server version: ${status.version?.split('\n')[0]}`);
    });
  } else {
    console.error("Failed to establish initial database connection:", status.error);
    process.exit(1);
  }
});
