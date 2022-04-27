const path = require("path");
const xlsx = require("node-xlsx");
const xlsxTemplate = require("xlsx-template");
const { randomUUID } = require("crypto");
const fs = require("fs").promises;

const filePath = path.join(__dirname, "./kinh_doanh.xlsx");

const kinhDoanhHeaders = [
  ["stt", "STT"],
  ["duan", "Dự án"],
  ["khachhang", "Khách hàng"],
  ["motaduan", "Mô tả dự án"],
  ["hinhthucdautu", "Hình thức đầu tư"],
  ["tongmucdautu", "Tổng mức đầu tư"],
  ["mucdokhathi", "Mức độ khả thi"],
  ["phantichswot", "Phân tích SWOT"],
  ["khokhan", "Khó khăn"],
  ["giaiphap", "Giải pháp"],
  ["priority", "Priority"],
  ["status", "Status"],
  ["pic", "PIC"],
  ["phoban", "Phó ban"],
  ["ketquathuchientuantruoc", "Kết quả thực hiện tuần trước"],
  ["ketquathuchientuannay", "Kết quả thực hiện tuần này"],
  ["kehoachtuannay", "Kế hoạch tuần này"],
  ["kehoachtuansau", "Kế hoạch tuần sau"],
];

const trienKhaiHeaders = [
  ["stt", "STT"],
  ["duan", "Dự án"],
  ["sohopdong", "Số hợp đồng"],
  ["masoketoan", "Mã số kế toán"],
  ["khachhang", "Khách hàng"],
  ["giatri", "Giá trị"],
  ["sotiendac", "Số tiền DAC"],
  ["dachopdong", "DAC hợp đồng"],
  ["muctieudac", "Mục tiêu DAC"],
  ["dacthucte", "DAC thực tế"],
  ["songayconlaidac", "Số ngày còn lại DAC"],
  ["sotienpac", "Số tiền PAC"],
  ["pachopdong", "PAC hợp đồng"],
  ["muctieupac", "Mục tiêu PAC"],
  ["pacthucte", "PAC thực tế"],
  ["songayconlaipac", "Số ngày còn lại PAC"],
  ["sotienfac", "Số tiền FAC"],
  ["fachopdong", "FAC hợp đồng"],
  ["muctieufac", "Mục tiêu FAC"],
  ["facthucte", "FAC thực tế"],
  ["songayconlaifac", "Số ngày còn lại FAC"],
  ["tiendochung", "Tiến độ chung"],
  ["khokhan", "Khó khăn"],
  ["giaiphap", "Giải pháp"],
  ["priority", "Priority"],
  ["status", "Status"],
  ["pic", "PIC"],
  ["phoban", "Phó ban"],
  ["ketquathuchientuantruoc", "Kết quả thực hiện tuần trước"],
  ["ketquathuchientuannay", "Kết quả thực hiện tuần này"],
  ["kehoachtuannay", "Kế hoạch tuần này"],
  ["kehoachtuansau", "Kế hoạch tuần sau"],
];

const kinhDoanhHeadersPosition = {};
kinhDoanhHeaders.forEach(
  (it, index) => (kinhDoanhHeadersPosition[it[0]] = index)
);

const trienKhaiHeadersPosition = {};
trienKhaiHeaders.forEach(
  (it, index) => (trienKhaiHeadersPosition[it[0]] = index)
);

const readFile = (filePath, headers) => {
  const fileData = xlsx.parse(filePath);
  const data = fileData[0].data;
  const final = data
    .slice(1)
    .map((item) => {
      if (item.length === 0) return;
      const result = {};
      headers.forEach(([key], index) => {
        result[key] = item[index] ?? "";
      });
      return result;
    })
    .filter((item) => item);

  return final;
};

const exportFile = async (data, type) => {
  // type = 1: kinh doanh, type = 0: trien khai
  // const headers =
  //   (type == 1 ? kinhDoanhHeaders : trienKhaiHeaders).map((it) => it[0]);
  const exportData = data;

  const templateFile = `${type == 1 ? "kinh_doanh" : "trien_khai"}.xlsx`;
  const templateFiePath = path.join(__dirname, "../", "template", templateFile);

  const exportFileName = `${new Date().getTime()}-${randomUUID()}-${
    type == 1 ? "kinhdoanh" : "trienkhai"
  }_export.xlsx`;
  const exportFilePath = path.join(__dirname, "../", "export", exportFileName);
  const exportFolder = path.join(__dirname, "../", "export");

  const fileTemplate = await fs.readFile(templateFiePath);
  const workbook = new xlsxTemplate(fileTemplate);
  workbook.substitute(1, { data: exportData });
  const buffer = workbook.generate({ type: "nodebuffer" });

  await fs.writeFile(exportFilePath, buffer);

  const validUntil = new Date().getTime() + 10 * 60 * 1000;

  setTimeout(() => {
    fs.unlink(exportFilePath, (err) => {
      if (err) console.log(err);
    });
  }, 10 * 60 * 1000);

  return { exportFilePath, exportFileName, exportFolder, validUntil };
};

module.exports = {
  readFile,
  exportFile,
  kinhDoanhHeaders,
  trienKhaiHeaders,
};
