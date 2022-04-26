var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
const path = require('path');
const excelRead = require('./helpers/excel');
const { randomUUID } = require('crypto');

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
  fileFilter: function (req, file, callback) { //file filter
    if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
      return callback(new Error('Wrong extension type'));
    }
    callback(null, true);
  }
}).single('file');
/** API path that will upload the files */
app.post('/upload', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      res.json({ error_code: 1, err_desc: err });
      return;
    }
    /** Multer gives us file info in req.file object */
    if (!req.file) {
      res.json({ error_code: 1, err_desc: "No file passed" });
      return;
    }
    /** Check the extension of the incoming file and 
     *  use the appropriate module
     */
    try {
      const data = excelRead(req.file.path);
      res.json({ error_code: 0, err_desc: null, data });
    } catch (e) {
      res.json({ error_code: 1, err_desc: "Corupted excel file" });
    }
  })
});

app.listen('3000', function () {
  console.log('Server running in port 3000');
});