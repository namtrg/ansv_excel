const excel = require("./helpers/excel");

module.exports = async(req, res) => {
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
};
