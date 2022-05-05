const path = require("path");
const fs = require("fs");
const schedule = require("node-schedule");
const deleteFile = require("util").promisify(fs.unlink);
import app from "./app";

schedule.scheduleJob("0 */1 * * *", async () => {
  const exportFolder = path.join(__dirname, "export");
  const files = fs.readdirSync(exportFolder);
  for (const file of files) {
    const filePath = path.join(exportFolder, file);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      const time = new Date(stat.mtime);
      const validUntil = new Date(time.getTime() + 1000 * 60 * 60 * 24);
      if (validUntil < new Date()) {
        await deleteFile(filePath);
      }
    }
  }
});

const PORT = process.env.PORT || 3001;
// import { AppDataSource } from "./data-source";

app.listen(PORT, function () {
  console.log("Server running in port " + PORT);
});