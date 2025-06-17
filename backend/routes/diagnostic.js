const express = require('express');
const sql = require('mssql');
const dns = require('dns').promises;
const net = require('net');
const os = require('os');
const { checkConnection } = require('../config/connection');

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

// Function to get network interfaces
const getNetworkInfo = () => {
    const interfaces = os.networkInterfaces();
    const networkInfo = {};
    
    for (const [name, addresses] of Object.entries(interfaces)) {
        networkInfo[name] = addresses.map(addr => ({
            address: addr.address,
            family: addr.family,
            internal: addr.internal
        }));
    }
    
    return networkInfo;
};

// Full diagnostic route
router.get('/', async (req, res) => {
    const results = {
        timestamp: new Date().toISOString(),
        environment: {
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch,
            env: process.env.NODE_ENV,
            processUser: process.env.USERNAME || process.env.USER,
            memoryUsage: process.memoryUsage(),
            uptime: process.uptime(),
            cwd: process.cwd(),
            hostname: os.hostname(),
            networkInterfaces: getNetworkInfo()
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
            results.checks.dns = {
                status: 'checking',
                details: {}
            };
            const dnsLookup = await dns.lookup(process.env.DB_HOST);
            results.checks.dns = {
                status: 'success',
                details: {
                    ip: dnsLookup.address,
                    family: dnsLookup.family
                }
            };
        } catch (error) {
            results.checks.dns = {
                status: 'failed',
                error: error.message
            };
        }

        // Port check
        try {
            results.checks.port = {
                status: 'checking'
            };
            const portOpen = await isPortOpen(process.env.DB_HOST, process.env.DB_PORT || 1433);
            results.checks.port = {
                status: portOpen ? 'success' : 'failed',
                details: {
                    port: process.env.DB_PORT || 1433,
                    isOpen: portOpen
                }
            };
        } catch (error) {
            results.checks.port = {
                status: 'failed',
                error: error.message
            };
        }

        // Database connection check
        try {
            results.checks.database = {
                status: 'checking'
            };
            const dbStatus = await checkConnection();
            results.checks.database = {
                status: dbStatus.connected ? 'success' : 'failed',
                details: dbStatus
            };
        } catch (error) {
            results.checks.database = {
                status: 'failed',
                error: error.message,
                code: error.code
            };
        }

    } catch (error) {
        results.error = error.message;
    }

    res.json(results);
});

module.exports = router;
