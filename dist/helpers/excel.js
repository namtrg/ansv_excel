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
const xlsx = require("node-xlsx");
const xlsxTemplate = require("xlsx-template");
const crypto_1 = require("crypto");
const fs = require("fs").promises;
const kinhDoanhHeaders = [
    ["stt", "STT"],
    ["name", "Dự án"],
    ["customer", "Khách hàng"],
    ["description", "Mô tả dự án"],
    ["hinh_thuc_dau_tu", "Hình thức đầu tư"],
    ["tong_muc_dau_tu_du_kien", "Tổng mức đầu tư"],
    ["muc_do_kha_thi", "Mức độ khả thi"],
    ["phan_tich_SWOT", "Phân tích SWOT"],
    ["general_issue", "Khó khăn"],
    ["solution", "Giải pháp"],
    ["priority", "Priority"],
    ["status", "Status"],
    ["pic_name", "PIC"],
    ["manager_name", "Phó ban"],
    ["ket_qua_thuc_hien_ke_hoach", "Kết quả thực hiện tuần trước"],
    ["ket_qua_thuc_hien_tuan_nay", "Kết quả thực hiện tuần này"],
    ["ke_hoach", "Kế hoạch tuần này"],
    ["ke_hoach_tuan_sau", "Kế hoạch tuần sau"],
];
const trienKhaiHeaders = [
    ["stt", "STT"],
    ["name", "Dự án"],
    ["projects_id", "Số hợp đồng"],
    ["ma_so_ke_toan", "Mã số kế toán"],
    ["customer", "Khách hàng"],
    ["tong_gia_tri_thuc_te", "Giá trị"],
    ["so_tien_DAC", "Số tiền DAC"],
    ["DAC", "DAC hợp đồng"],
    ["ke_hoach_thanh_toan_DAC", "Mục tiêu DAC"],
    ["thuc_te_thanh_toan_DAC", "DAC thực tế"],
    ["so_ngay_con_lai_DAC", "Số ngày còn lại DAC"],
    ["so_tien_PAC", "Số tiền PAC"],
    ["PAC", "PAC hợp đồng"],
    ["ke_hoach_thanh_toan_PAC", "Mục tiêu PAC"],
    ["thuc_te_thanh_toan_PAC", "PAC thực tế"],
    ["so_ngay_con_lai_PAC", "Số ngày còn lại PAC"],
    ["so_tien_FAC", "Số tiền FAC"],
    ["FAC", "FAC hợp đồng"],
    ["ke_hoach_thanh_toan_FAC", "Mục tiêu FAC"],
    ["thuc_te_thanh_toan_FAC", "FAC thực tế"],
    ["so_ngay_con_lai_FAC", "Số ngày còn lại FAC"],
    ["pham_vi_cung_cap", "Tiến độ chung"],
    ["general_issue", "Khó khăn"],
    ["solution", "Giải pháp"],
    ["priority", "Priority"],
    ["status", "Status"],
    ["am", "AM"],
    ["pm", "PM"],
    ["manager_name", "Phó ban"],
    ["ket_qua_thuc_hien_ke_hoach", "Kết quả thực hiện tuần trước"],
    ["ket_qua_thuc_hien_tuan_nay", "Kết quả thực hiện tuần này"],
    ["ke_hoach", "Kế hoạch tuần này"],
    ["ke_hoach_tuan_sau", "Kế hoạch tuần sau"],
];
const kinhDoanhHeadersPosition = {};
kinhDoanhHeaders.forEach((it, index) => (kinhDoanhHeadersPosition[it[0]] = index));
const trienKhaiHeadersPosition = {};
trienKhaiHeaders.forEach((it, index) => (trienKhaiHeadersPosition[it[0]] = index));
const readFile = (filePath, headers) => {
    const fileData = xlsx.parse(filePath);
    const data = fileData[0].data;
    const final = data
        .slice(1)
        .map((item) => {
        if (item.length === 0)
            return;
        const result = {};
        headers.forEach(([key], index) => {
            var _a;
            result[key] = (_a = item[index]) !== null && _a !== void 0 ? _a : "";
        });
        return result;
    })
        .filter((item) => item);
    return final;
};
const exportFile = (data, type) => __awaiter(void 0, void 0, void 0, function* () {
    // type = 1: kinh doanh, type = 0: trien khai
    // const headers =
    //   (type == 1 ? kinhDoanhHeaders : trienKhaiHeaders).map((it) => it[0]);
    const exportData = data;
    const templateFile = `${type == 1 ? "trien_khai" : "kinh_doanh"}.xlsx`;
    const templateFiePath = path.join(__dirname, "../", "template", templateFile);
    const exportFileName = `${type == 1 ? "Trien khai" : type == 2 ? "Vien thong" : "Chuyen doi so"}_export_${new Date().getTime()}-${(0, crypto_1.randomUUID)()}.xlsx`;
    const exportFilePath = path.join(__dirname, "../", "export", exportFileName);
    const exportFolder = path.join(__dirname, "../", "export");
    const fileTemplate = yield fs.readFile(templateFiePath);
    const workbook = new xlsxTemplate(fileTemplate);
    workbook.substitute(1, { data: exportData });
    const buffer = workbook.generate({ type: "nodebuffer" });
    yield fs.writeFile(exportFilePath, buffer);
    const validUntil = new Date().getTime() + 10 * 60 * 1000;
    setTimeout(() => {
        fs.unlink(exportFilePath, (err) => {
            if (err)
                console.log(err);
        });
    }, 10 * 60 * 1000);
    return { exportFilePath, exportFileName, exportFolder, validUntil };
});
module.exports = {
    readFile,
    exportFile,
    kinhDoanhHeaders,
    trienKhaiHeaders,
};
