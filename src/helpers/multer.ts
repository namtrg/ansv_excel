import * as multer from "multer";
const path = require("path");
import { randomUUID } from "crypto";

var storage = multer.diskStorage({
  //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../upload"));
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now() + "_" + randomUUID();
    const newFileName = `${file.fieldname}_${datetimestamp}${path.extname(
      file.originalname
    )}`;
    cb(null, newFileName);
  },
});
var upload = multer({
  //multer settings
  storage: storage,
  limits: {
    fileSize: 30 * 1024 * 5,
  },
  dest: path.join(__dirname, "../upload"),
  fileFilter: function (req, file, callback) {
    //file filter
    const fileExtension = path.extname(file.originalname);
    // console.log([".xls", ".xlsx"].includes(fileExtension));
    if (![".xls", ".xlsx"].includes(fileExtension)) {
      return callback(new Error("Định danh file không hợp lệ"));
    }
    callback(null, true);
  },
}).single("file");

module.exports = upload;
