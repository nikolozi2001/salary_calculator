module.exports = {
  apps: [{
    name: 'salary-calculator-api',
    namespace: 'sallarium',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8000
    },
    node_args: '--experimental-specifier-resolution=node' // Add this for ES modules support
  }]
};
