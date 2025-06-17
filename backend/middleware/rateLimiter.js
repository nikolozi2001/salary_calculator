const rateLimit = require('express-rate-limit');

// Create a limiter for API endpoints
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

// More restrictive limiter for diagnostic endpoints
const diagnosticLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: {
        error: 'Too many diagnostic requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = { apiLimiter, diagnosticLimiter };
