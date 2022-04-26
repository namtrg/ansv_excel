var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var multer = require("multer");
const path = require("path");
const excel = require("./helpers/excel");
const { randomUUID } = require("crypto");
const util = require("util");
const fs = require("fs");

const deleteFile = util.promisify(fs.unlink);

app.use(bodyParser.json());
var storage = multer.diskStorage({
  //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "./upload"));
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
  dest: path.join(__dirname, "./tmp"),
  fileFilter: function (req, file, callback) {
    //file filter
    const fileExtension = path.extname(file.originalname);
    // console.log(fileExtension);
    if ([".xls", ".xlsx"].indexOf(fileExtension) === -1) {
      return callback(new Error("Định danh file không hợp lệ"));
    }
    callback(null, true);
  },
}).single("file");
/** API path that will upload the files */
app.post("/upload", function (req, res) {
  upload(req, res, function (error) {
    if (error) {
      res.status(400).json({
        error_code: 4,
        err_desc: "Định dạng tệp phải là xls hoặc xlsx",
        error_detail: error,
      });
      return;
    }
    const time = new Date();

    if (!req.file) {
      res.status(400).json({
        error_code: 1,
        err_desc: "Không có file được tải lên",
        error_detail: "",
      });
      return;
    }

    console.log(
      `[${time.getFullYear()}/${
        time.getMonth() + 1
      }/${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}]` +
        " New file uploaded: " +
        req.file?.originalname +
        ` from ip: ${
          req.headers["x-forwarded-for"] || req.socket.remoteAddress
        }`
    );

    let headers = -1;
    let fileType = "Unknown";
    let fileTypeCode = -1;
    if (req.file.originalname.toLowerCase().includes("trien_khai")) {
      headers = excel.trienKhaiHeaders;
      fileType = "Triển khai";
      fileTypeCode = 0;
    } else if (req.file.originalname.toLowerCase().includes("kinh_doanh")) {
      headers = excel.kinhDoanhHeaders;
      fileType = "Kinh doanh";
      fileTypeCode = 1;
    } else {
      res.status(400).json({
        error_code: 3,
        err_desc:
          'Tên file không hợp lệ. Tên phải chứa "kinh_doanh" hoặc "trien_khai"',
        error_detail: "Invaild name",
      });
      return;
    }
    /** Multer gives us file info in req.file object */
    /** Check the extension of the incoming file and
     *  use the appropriate module
     */
    try {
      const data = excel.readFile(req.file.path, headers);
      res.status(200).json({
        error_code: 0,
        fileType,
        fileTypeCode,
        err_desc: null,
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        error_code: 2,
        err_desc: "File lỗi. Không thể đọc file",
        error_detail: error,
      });
    }
    deleteFile(req.file.path)
      .then((res) => console.log("Cleaned file " + req.file.path))
      .catch((err) => console.log(err));
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log("Server running in port " + PORT);
});
