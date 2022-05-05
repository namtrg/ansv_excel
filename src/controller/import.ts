const multer = require("../helpers/multer");
const excel = require("../helpers/excel");
const fs = require("fs");
import { Response } from "express";

const deleteFile = require("util").promisify(fs.unlink);

export default function importController(req, res: Response) {
  multer(req, res, function (error) {
    if (error) {
      res.status(400).json({
        error_code: 4,
        err_desc: "Định dạng tệp phải là xls hoặc xlsx",
        // error_detail: error,
      });
      return;
    }
    const time = new Date();

    if (!req.file) {
      res.status(400).json({
        error_code: 1,
        err_desc: "Không có file được tải lên",
        // error_detail: "",
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
        // error_detail: "Invaild name",
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
        // error_detail: error,
      });
    }
    deleteFile(req.file.path)
      .then((res) => console.log("Cleaned file " + req.file.path))
      .catch((err) => console.log(err));
  });
}
