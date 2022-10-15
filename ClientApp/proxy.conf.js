const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:19537';

const wsTarget = env.ASPNETCORE_HTTPS_PORT ? `wss://localhost:${env.ASPNETCORE_HTTPS_PORT}` : 'wss://localhost:7181';

const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
      "/_configuration",
      "/.well-known",
      "/Identity",
      "/connect",
      "/ApplyDatabaseMigrations",
      "/_framework",
      "/api",
   ],
    target: target,
    secure: false,
    changeOrigin: true,
    headers: {
      Connection: 'Keep-Alive'
    }
  },
  {
    context: [
      "/quizhub"
   ],
    target: wsTarget,
    secure: false,
    changeOrigin: true,
    ws: true,
    "logLevel": "debug",
  },
]

module.exports = PROXY_CONFIG;
