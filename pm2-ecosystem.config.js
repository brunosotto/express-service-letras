// configuração de execução no pm2

const auto = "auto";

module.exports = {
  apps: [
    {
      name: auto,
      script: "start.js",
      watch: false,
      env: {
        PORT: auto,
        NODE_ENV: auto,
      }
    }
  ]
}
