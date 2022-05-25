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
const multer = require("../helpers/multer");
const excel = require("../helpers/excel");
const fs = require("fs");
const moment = require("moment");
const db_1 = require("../db");
// moment.locale('vi');
// console.log(moment().week());
const deleteFile = require("util").promisify(fs.unlink);
function importController(req, res) {
    multer(req, res, function (error) {
        var _a;
        if (error) {
            res.status(400).json({
                error_code: 4,
                err_desc: "Định dạng tệp phải là xls hoặc xlsx",
                message: "Định dạng tệp phải là xls hoặc xlsx"
                // error_detail: error,
            });
            return;
        }
        const time = new Date();
        if (!req.file) {
            res.status(400).json({
                error_code: 1,
                err_desc: "Không có file được tải lên",
                message: "Không có file được tải lên",
                // error_detail: "",
            });
            return;
        }
        console.log(`[${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}]` +
            " New file uploaded: " +
            ((_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname) +
            ` from ip: ${req.headers["x-forwarded-for"] || req.socket.remoteAddress}`);
        let headers = -1;
        let fileType = "Unknown";
        let fileTypeCode = -1;
        if (req.file.originalname
            .toLowerCase()
            .replace(/\s+/g, "_")
            .includes("trien_khai")) {
            headers = excel.trienKhaiHeaders;
            fileType = "Triển khai";
            fileTypeCode = 1;
        }
        else if (req.file.originalname
            .toLowerCase()
            .replace(/\s+/g, "_")
            .includes("vien_thong")) {
            headers = excel.kinhDoanhHeaders;
            fileType = "Viễn thông";
            fileTypeCode = 2;
        }
        else if (req.file.originalname
            .toLowerCase()
            .replace(/\s+/g, "_")
            .includes("chuyen_doi_so")) {
            headers = excel.kinhDoanhHeaders;
            fileType = "Chuyển đổi số";
            fileTypeCode = 3;
        }
        else {
            res.status(400).json({
                error_code: 3,
                err_desc: 'Tên file không hợp lệ. Tên phải chứa "kinh_doanh", "chuyen_doi_so" hoặc "vien_thong"',
                message: 'Tên file không hợp lệ. Tên phải chứa "kinh_doanh", "chuyen_doi_so" hoặc "vien_thong"',
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
            const result = Promise.all(data.map((item, index) => updateRow(item, index, fileTypeCode)))
                .then((res1) => {
                res.status(200).json({
                    error_code: 0,
                    fileType,
                    fileTypeCode,
                    err_desc: null,
                    message: "Import thành công " + res1.length + ' hàng'
                });
            })
                .catch((error) => {
                res.status(400).json({
                    error_code: 8,
                    err_desc: error.message,
                    message: error.message,
                });
            });
        }
        catch (error) {
            console.log(error);
            res.status(400).json({
                error_code: 2,
                err_desc: "File lỗi. Không thể đọc file",
                message: "File lỗi. Không thể đọc file",
                // error_detail: error,
            });
        }
        deleteFile(req.file.path)
            .then((res) => console.log("Cleaned file " + req.file.path))
            .catch((err) => console.log(err));
    });
}
exports.default = importController;
function updateRow(item, index, fileTypeCode) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __awaiter(this, void 0, void 0, function* () {
        let connection = yield db_1.pool.getConnection();
        yield connection.beginTransaction();
        try {
            let { stt, name, projects_id, ma_so_ke_toan, customer, tong_gia_tri_thuc_te, so_tien_DAC, DAC, ke_hoach_thanh_toan_DAC, thuc_te_thanh_toan_DAC, so_ngay_con_lai_DAC, so_tien_PAC, PAC, ke_hoach_thanh_toan_PAC, thuc_te_thanh_toan_PAC, so_ngay_con_lai_PAC, so_tien_FAC, FAC, ke_hoach_thanh_toan_FAC, thuc_te_thanh_toan_FAC, so_ngay_con_lai_FAC, pham_vi_cung_cap, general_issue, solution, priority, status, am, pm, manager_name, ket_qua_thuc_hien_ke_hoach, ket_qua_thuc_hien_tuan_nay, ke_hoach, ke_hoach_tuan_sau, description, hinh_thuc_dau_tu, tong_muc_dau_tu_du_kien, muc_do_kha_thi, phan_tich_SWOT, pic_name, } = item;
            let p_id = -1, c_id = -1, priority_id = -1, status_id = -1, am_id = -1, pm_id = -1;
            // project
            const [rows] = (yield connection.query("SELECT * FROM `project` WHERE name=? and interactive=?", [name, "create"]));
            if ((rows === null || rows === void 0 ? void 0 : rows.length) > 1) {
                throw new Error("Lỗi lặp dự án mới - " + (index + 1));
            }
            else if ((rows === null || rows === void 0 ? void 0 : rows.length) == 1) {
                p_id = (_a = rows[0]) === null || _a === void 0 ? void 0 : _a.id;
                // Ok
            }
            // khachhang
            const [KH] = (yield connection.query("SELECT * FROM `customers` WHERE name=?", [customer]));
            if ((KH === null || KH === void 0 ? void 0 : KH.length) > 1) {
                throw new Error("Lỗi lặp khách hàng - " + (index + 1));
            }
            else if ((KH === null || KH === void 0 ? void 0 : KH.length) == 1) {
                c_id = (_b = KH[0]) === null || _b === void 0 ? void 0 : _b.id;
                // Ok
            }
            else {
                throw new Error("Không thấy khách hàng");
            }
            // am
            const [AM_] = (yield connection.query("SELECT users.id as aid FROM `users` inner join users_roles on users.id = users_roles.user inner join role on users_roles.role = role.id WHERE users.display_name=? and role.name='ROLE_AM'", [pic_name || am]));
            // console.log(customer, AM_);
            if ((AM_ === null || AM_ === void 0 ? void 0 : AM_.length) > 1) {
                throw new Error("Lỗi lặp am - " + (index + 1));
            }
            else if ((AM_ === null || AM_ === void 0 ? void 0 : AM_.length) == 1) {
                am_id = (_c = AM_[0]) === null || _c === void 0 ? void 0 : _c.aid;
                // Ok
            }
            else {
                throw new Error("Không thấy AM  - " + (index + 1));
            }
            // pm
            if (fileTypeCode === 1) {
                const [pm_] = (yield connection.query("SELECT users.id as pid FROM `users` inner join users_roles on users.id = users_roles.user inner join role on users_roles.role = role.id WHERE users.display_name=? and role.name='ROLE_PM'", [pm]));
                if ((pm_ === null || pm_ === void 0 ? void 0 : pm_.length) > 1) {
                    throw new Error("Lỗi lặp PM - " + (index + 1));
                }
                else if ((pm_ === null || pm_ === void 0 ? void 0 : pm_.length) == 1) {
                    pm_id = (_d = pm_[0]) === null || _d === void 0 ? void 0 : _d.pid;
                    // Ok
                }
                else {
                    throw new Error("Không thấy PM  - " + (index + 1));
                }
            }
            // priority
            switch ((_e = priority === null || priority === void 0 ? void 0 : priority.toLowerCase) === null || _e === void 0 ? void 0 : _e.call(priority)) {
                case "first":
                    priority_id = 1;
                    break;
                case "second":
                    priority_id = 2;
                    break;
                case "third":
                    priority_id = 3;
                    break;
                default:
                    throw new Error("Priority không tồn tại");
            }
            // status
            switch ((_f = status === null || status === void 0 ? void 0 : status.toLowerCase) === null || _f === void 0 ? void 0 : _f.call(status)) {
                case "high":
                    status_id = 1;
                    break;
                case "medium":
                    status_id = 2;
                    break;
                case "low":
                    status_id = 3;
                    break;
                default:
                    throw new Error("status không tồn tại");
            }
            // OK
            if (p_id !== -1) {
                const [rows] = yield connection.execute("Update project set interactive='old' where id=?", [p_id]);
            }
            if (fileTypeCode === 1) {
                // không có
                [
                    DAC,
                    PAC,
                    FAC,
                    ke_hoach_thanh_toan_DAC,
                    thuc_te_thanh_toan_DAC,
                    ke_hoach_thanh_toan_PAC,
                    thuc_te_thanh_toan_PAC,
                    ke_hoach_thanh_toan_FAC,
                    thuc_te_thanh_toan_FAC,
                ] = [
                    DAC,
                    PAC,
                    FAC,
                    ke_hoach_thanh_toan_DAC,
                    thuc_te_thanh_toan_DAC,
                    ke_hoach_thanh_toan_PAC,
                    thuc_te_thanh_toan_PAC,
                    ke_hoach_thanh_toan_FAC,
                    thuc_te_thanh_toan_FAC,
                ].map((it) => {
                    if (!!!it)
                        return null;
                    return moment(it, "DD/MM/YYYY").format("YYYY-MM-DD");
                });
                [so_tien_DAC, so_tien_FAC, so_tien_PAC] = [
                    so_tien_DAC,
                    so_tien_FAC,
                    so_tien_PAC,
                ].map((it) => it || 0);
                [tong_gia_tri_thuc_te] = [tong_gia_tri_thuc_te].map((it) => {
                    if (it === undefined || String(it).trim() === "")
                        return null;
                    return it;
                });
                // console.log(DAC);
                let params = [
                    fileTypeCode,
                    priority_id,
                    status_id,
                    c_id,
                    moment().week(),
                    ma_so_ke_toan,
                    name,
                    projects_id,
                    pham_vi_cung_cap,
                    DAC,
                    PAC,
                    FAC,
                    null,
                    null,
                    so_tien_DAC,
                    ke_hoach_thanh_toan_DAC,
                    thuc_te_thanh_toan_DAC,
                    so_tien_PAC,
                    ke_hoach_thanh_toan_PAC,
                    thuc_te_thanh_toan_PAC,
                    so_tien_FAC,
                    ke_hoach_thanh_toan_FAC,
                    thuc_te_thanh_toan_FAC,
                    ke_hoach,
                    general_issue,
                    solution,
                    ket_qua_thuc_hien_ke_hoach,
                    "",
                    "create",
                    new Date(),
                    tong_gia_tri_thuc_te,
                ].map((it) => {
                    if (it === undefined)
                        return null;
                    return it;
                });
                let sql = `INSERT INTO project (project_type, priority, project_status, customer, week, year, ma_so_ke_toan, name, projects_id, pham_vi_cung_cap, DAC, PAC, FAC, so_tien_tam_ung, ke_hoach_tam_ung, so_tien_DAC, ke_hoach_thanh_toan_DAC, thuc_te_thanh_toan_DAC, so_tien_PAC, ke_hoach_thanh_toan_PAC, thuc_te_thanh_toan_PAC, so_tien_FAC, ke_hoach_thanh_toan_FAC, thuc_te_thanh_toan_FAC, ke_hoach, general_issue, solution, ket_qua_thuc_hien_ke_hoach, note, interactive, created_at, tong_gia_tri_thuc_te) VALUES (?, ?, ?, ?, ?, year(curdate()), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const [rows] = (yield connection.execute(sql, params));
                p_id = ((_g = rows === null || rows === void 0 ? void 0 : rows[0]) === null || _g === void 0 ? void 0 : _g.insertId) || (rows === null || rows === void 0 ? void 0 : rows.insertId);
                // console.log(p_id, am_id, pm_id);
                const [new_AM] = yield connection.execute("insert into `pic`(project_id, pic) values (?, ?)", [p_id, am_id]);
                const [new_pm] = yield connection.execute("insert into `pic`(project_id, pic) values (?, ?)", [p_id, pm_id]);
            }
            else {
                const params2 = [
                    fileTypeCode,
                    priority_id,
                    status_id,
                    c_id,
                    moment().week(),
                    name,
                    description,
                    tong_muc_dau_tu_du_kien,
                    hinh_thuc_dau_tu,
                    muc_do_kha_thi,
                    phan_tich_SWOT,
                    ke_hoach_tuan_sau,
                    general_issue,
                    solution,
                    ket_qua_thuc_hien_tuan_nay,
                    "",
                    "create",
                    new Date(),
                ].map((it) => {
                    if (it === undefined)
                        return null;
                    return it;
                });
                const sql2 = "INSERT INTO project (project_type, priority, project_status, customer, week, year, name, " +
                    "description, tong_muc_dau_tu_du_kien, hinh_thuc_dau_tu, muc_do_kha_thi, phan_tich_SWOT, " +
                    "ke_hoach, general_issue, solution, ket_qua_thuc_hien_ke_hoach, note, interactive, created_at) " +
                    "VALUES (?, ?, ?, ?, ?, year(curdate()), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                const [rows] = (yield connection.execute(sql2, params2));
                p_id = (rows === null || rows === void 0 ? void 0 : rows.insertId) || ((_h = rows === null || rows === void 0 ? void 0 : rows[0]) === null || _h === void 0 ? void 0 : _h.insertId);
                // console.log(p_id, am_id);
                const [new_AM] = yield connection.execute("insert into `pic`(project_id, pic) values (?, ?)", [p_id, am_id]);
            }
            yield connection.commit();
            connection.release();
        }
        catch (error) {
            console.log(error);
            yield connection.rollback();
            connection.release();
            throw error;
        }
    });
}
