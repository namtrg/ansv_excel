module.exports = {
  apps: [
    {
      name: "Excel handler",
      exec_mode: "cluster",
      instances: "1",
      script: "./dist/index.js", // your script
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: "3001",
        TZ: "Asia/Ho_Chi_Minh",
        "DB_HOST": "",
        "DB_PORT": "",
        "DB_NAME": "",
        "DB_USER": "",
        "DB_PASS": "",
      },
    },
  ],
};