var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
const path = require('path');
const excel = require('./helpers/excel');
const { randomUUID } = require('crypto');
const util = require('util');
const fs = require('fs');

const deleteFile = util.promisify(fs.unlink);

app.use(bodyParser.json());
var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, './upload'));
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now() + '_' + randomUUID();
    cb(null, file.fieldname + '_' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
  }
});
var upload = multer({ //multer settings
  storage: storage,
  dest: path.join(__dirname, './tmp'),
  fileFilter: function (req, file, callback) { //file filter
    if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
      return callback(new Error('Định danh file không hợp lệ'));
    }
    callback(null, true);
  }
}).single('file');
/** API path that will upload the files */
app.post('/upload', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      res.json({ error_code: 4, err_desc: "Định dạng tệp phải là xls hoặc xlsx" });
      return;
    }
    const time = new Date();
    console.log(`[${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}]` + " New file uploaded: " + req.file.originalname);

    let headers = -1;
    let fileType = "Unknown";
    if (req.file.originalname.toLowerCase().includes('trien_khai')) {
      headers = excel.trienKhaiHeaders;
      fileType = "Triển khai";
    }
    else if (req.file.originalname.toLowerCase().includes('kinh_doanh')) {
      headers = excel.kinhDoanhHeaders;
      fileType = "Kinh doanh";
    }
    else {
      res.json({ error_code: 3, err_desc: 'Tên file không hợp lệ. Tên phải chứa "kinh_doanh" hoặc "trien_khai"' });
      return;
    }
    /** Multer gives us file info in req.file object */
    if (!req.file) {
      res.json({ error_code: 1, err_desc: "Không có file được tải lên" });
      return;
    }
    /** Check the extension of the incoming file and 
     *  use the appropriate module
     */
    try {
      const data = excel.readFile(req.file.path, headers);
      res.json({ error_code: 0, fileType: fileType, err_desc: null, data });
    } catch (e) {
      res.json({ error_code: 2, err_desc: "File lỗi. Không thể đọc file" });
    }
    deleteFile(req.file.path)
      .then(res => console.log("Cleaned file " + req.file.path))
      .catch(err => console.log(err));
  })
});

app.listen('3000', function () {
  console.log('Server running in port 3000');
});