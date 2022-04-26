const path = require('path');
const xlsx = require('node-xlsx');

const filePath = path.join(__dirname, './kinh_doanh.xlsx');

const headers = [
  [
    "stt",
    "STT"
  ],
  [
    "duan",
    "Dự án"
  ],
  [
    "khachhang",
    "Khách hàng"
  ],
  [
    "motaduan",
    "Mô tả dự án"
  ],
  [
    "hinhthucdautu",
    "Hình thức đầu tư"
  ],
  [
    "tongmucdautu",
    "Tổng mức đầu tư"
  ],
  [
    "mucdokhathi",
    "Mức độ khả thi"
  ],
  [
    "phantichswot",
    "Phân tích SWOT"
  ],
  [
    "khokhan",
    "Khó khăn"
  ],
  [
    "giaiphap",
    "Giải pháp"
  ],
  [
    "priority",
    "Priority"
  ],
  [
    "status",
    "Status"
  ],
  [
    "pic",
    "PIC"
  ],
  [
    "phoban",
    "Phó ban"
  ],
  [
    "ketquathuchientuantruoc",
    "Kết quả thực hiện tuần trước"
  ],
  [
    "ketquathuchientuannay",
    "Kết quả thực hiện tuần này"
  ],
  [
    "kehoachtuannay",
    "Kế hoạch tuần này"
  ],
  [
    "kehoachtuansau",
    "Kế hoạch tuần sau"
  ]
]


module.exports = (filePath) => {
  const fileData = xlsx.parse(filePath);
  const data = fileData[0].data;
  const final = data.slice(1).map(item => {
    if (item.length === 0) return
    const result = {};
    headers.forEach(([key], index) => {
      result[key] = item[index] ?? "";
    });
    return result;
  }).filter(item => item);

  return final;
}