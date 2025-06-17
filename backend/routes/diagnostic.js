const express = require('express');
const sql = require('mssql');
const dns = require('dns').promises;
const net = require('net');

const router = express.Router();

// Function to check if a port is open
const isPortOpen = (host, port) => {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        
        const onError = () => {
            socket.destroy();
            resolve(false);
        };

        socket.setTimeout(1000);
        socket.once('error', onError);
        socket.once('timeout', onError);

        socket.connect(port, host, () => {
            socket.end();
            resolve(true);
        });
    });
};

// Diagnostic route
router.get('/', async (req, res) => {
    const results = {
        timestamp: new Date().toISOString(),
        environment: {
            nodeVersion: process.version,
            platform: process.platform,
            env: process.env.NODE_ENV,
            processUser: process.env.USERNAME || process.env.USER
        },
        database: {
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER,
            port: process.env.DB_PORT || 1433
        },
        checks: {}
    };

    try {
        // DNS lookup
        try {
            const dnsResult = await dns.lookup(process.env.DB_HOST);
            results.checks.dns = {
                success: true,
                ip: dnsResult.address
            };
        } catch (err) {
            results.checks.dns = {
                success: false,
                error: err.message
            };
        }

        // Port check
        try {
            const port = parseInt(process.env.DB_PORT) || 1433;
            const isOpen = await isPortOpen(process.env.DB_HOST, port);
            results.checks.port = {
                success: isOpen,
                port: port
            };
        } catch (err) {
            results.checks.port = {
                success: false,
                error: err.message
            };
        }

        // SQL Server connection test
        try {
            const config = {
                server: process.env.DB_HOST,
                database: process.env.DB_DATABASE,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                options: {
                    encrypt: false,
                    trustServerCertificate: true,
                    port: parseInt(process.env.DB_PORT) || 1433
                }
            };

            const pool = await sql.connect(config);
            const result = await pool.request().query('SELECT @@VERSION as version, SYSTEM_USER as currentUser, @@SERVERNAME as serverName');
            await pool.close();

            results.checks.sqlServer = {
                success: true,
                version: result.recordset[0].version,
                currentUser: result.recordset[0].currentUser,
                serverName: result.recordset[0].serverName
            };
        } catch (err) {
            results.checks.sqlServer = {
                success: false,
                error: err.message,
                code: err.code
            };
        }

    } catch (err) {
        results.error = err.message;
    }

    res.json(results);
});

module.exports = router;
