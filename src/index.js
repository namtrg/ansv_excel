var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var multer = require("multer");
const path = require("path");
const excel = require("./helpers/excel");
const { randomUUID } = require("crypto");
const util = require("util");
const fs = require("fs");
const schedule = require("node-schedule");

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

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

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

app.post("/export", async (req, res) => {
  const data = req.body.data;
  const fileTypeCode = req.body.fileTypeCode;
  if (!data) {
    res.status(400).json({
      error_code: 5,
      err_desc: "Không có dữ liệu",
      error_detail: "",
    });
    return;
  }
  if (fileTypeCode !== 0 && fileTypeCode !== 1) {
    res.status(400).json({
      error_code: 6,
      err_desc: "fileTypeCode phải là 0 hoặc 1",
      error_detail: "",
    });
    return;
  }
  const { fileExportPath, exportFileName, validUntil } = await excel.exportFile(
    data,
    fileTypeCode
  );
  res.status(200).json({
    error_code: 0,
    err_desc: null,
    data: { file: exportFileName, validUntil },
  });

  // res.writeHead(200, {
  //   "Content-Type":
  //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   "Content-Disposition":
  //     "attachment; filename=" + `${randomUUID()}-${fileTypeCode}.xlsx`,
  // });
  // res.end(new Buffer.from(await excel.exportFile(data, fileTypeCode), "base64"));
});

app.get("/download", (req, res) => {
  const file = req.query.file;
  const exportFolder = path.join(__dirname, "export");
  const filePath = path.join(exportFolder, file);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({
      error_code: 1,
      err_desc: "Không tìm thấy file",
      error_detail: "",
    });
    return;
  }
  res.download(filePath);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log("Server running in port " + PORT);
});


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
