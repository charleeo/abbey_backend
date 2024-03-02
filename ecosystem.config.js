module.exports = {
    apps : [{
      name        : "nestjsapp",
      script      : "dist/src/main.js",
      watch       : true,
      args : 'run build',
      env: {
        NODE_ENV: "production"
      },
      env_production : {
        NODE_ENV: "production"
      }
    }]
  };
  