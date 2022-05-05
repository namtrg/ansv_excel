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
        PORT: "3000",
        TZ: "Asia/Ho_Chi_Minh",
      },
    },
  ],
};