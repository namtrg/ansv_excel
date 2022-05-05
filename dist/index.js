"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const schedule = require("node-schedule");
const deleteFile = require("util").promisify(fs.unlink);
const app_1 = require("./app");
schedule.scheduleJob("0 */1 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    const exportFolder = path.join(__dirname, "export");
    const files = fs.readdirSync(exportFolder);
    for (const file of files) {
        const filePath = path.join(exportFolder, file);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
            const time = new Date(stat.mtime);
            const validUntil = new Date(time.getTime() + 1000 * 60 * 60 * 24);
            if (validUntil < new Date()) {
                yield deleteFile(filePath);
            }
        }
    }
}));
const PORT = process.env.PORT || 3001;
// import { AppDataSource } from "./data-source";
app_1.default.listen(PORT, function () {
    console.log("Server running in port " + PORT);
});
