module.exports = {
    apps: [{
      name: 'web-gtsp',
      script: 'npm',
      args: 'start',
      cwd: './',
      env: {
        NODE_ENV: 'development',
        PORT: 3537, 
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3537, 
      },
    }],
  };