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
const excel = require("../helpers/excel");
const db_1 = require("../db");
function addZero(number) {
    return number < 10 ? "0" + number : number.toString();
}
function convertDateToString(date) {
    const day = addZero(date.getDate());
    const month = addZero(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // const data = req.body.data;
    // 1: triển khai
    // 2 Viên thông
    // 3 chuyển đổi số
    let connection;
    try {
        const { type, week } = req.body;
        if (![1, 2, 3].includes(+type)) {
            res.status(400).json({
                error_code: 6,
                err_desc: "Type phải là 1, 2 hoặc 3",
                error_detail: "",
            });
            return;
        }
        connection = yield db_1.pool.getConnection();
        let data = [];
        if (+type === 1) {
            const [rows, fields] = yield connection.execute("SELECT project.id, projects_types.name AS type, priorities.name AS priority, projects_status.name AS status, customers.name AS customer, project.week, project.year, project.projects_id, project.ma_so_ke_toan, project.name, project.pham_vi_cung_cap, project.tong_gia_tri_thuc_te, project.DAC, project.FAC, project.PAC, project.so_tien_tam_ung, project.ke_hoach_tam_ung, project.so_tien_DAC, project.ke_hoach_thanh_toan_DAC, project.thuc_te_thanh_toan_DAC, project.so_tien_PAC, project.ke_hoach_thanh_toan_PAC, project.thuc_te_thanh_toan_PAC, project.so_tien_FAC, project.ke_hoach_thanh_toan_FAC, project.thuc_te_thanh_toan_FAC, project.ke_hoach, project.general_issue, project.solution, project.ket_qua_thuc_hien_ke_hoach FROM project INNER JOIN projects_types ON project.project_type = projects_types.id INNER JOIN priorities ON project.priority = priorities.id INNER JOIN projects_status ON project.project_status = projects_status.id INNER JOIN customers ON project.customer = customers.id WHERE project.week = ? AND project.project_type = ?", [week, type]);
            const result = JSON.parse(JSON.stringify(rows));
            for (const row of result) {
                row.tong_gia_tri_thuc_te || (row.tong_gia_tri_thuc_te = "");
                row.so_tien_DAC || (row.so_tien_DAC = "");
                row.so_tien_FAC || (row.so_tien_FAC = "");
                row.so_tien_PAC || (row.so_tien_PAC = "");
                if (row.FAC) {
                    const date = new Date(row.FAC);
                    row.FAC = convertDateToString(date);
                }
                if (row.ke_hoach_thanh_toan_FAC) {
                    const date = new Date(row.ke_hoach_thanh_toan_FAC);
                    row.ke_hoach_thanh_toan_FAC = convertDateToString(date);
                }
            }
            yield Promise.allSettled(result.map((row) => __awaiter(void 0, void 0, void 0, function* () {
                const [rows2] = yield connection.execute("SELECT users.display_name as display_name, role.name as role_name FROM users INNER JOIN users_roles ON users.id = users_roles.user INNER JOIN role ON users_roles.role = role.id INNER JOIN pic ON users.id = pic.pic INNER JOIN project ON pic.project_id = project.id WHERE project.id = ?", [row.id]);
                const AM = rows2.find((row2) => row2.role_name === "ROLE_AM").display_name;
                const PM = rows2.find((row2) => row2.role_name === "ROLE_PM").display_name;
                row.AM = AM !== null && AM !== void 0 ? AM : "";
                row.PM = PM !== null && PM !== void 0 ? PM : "";
                data.push(row);
            })));
        }
        else if (+type === 2 || +type === 3) {
            const [rows] = yield connection.execute("SELECT project.id AS project_id, users.display_name AS pic_name, projects_types.name AS project_type, priorities.name AS priority, projects_status.name AS project_status, customers.name, project.week, project.year, project.name, project.description, project.tong_muc_dau_tu_du_kien, project.hinh_thuc_dau_tu, project.muc_do_kha_thi, project.phan_tich_SWOT, project.general_issue, project.ke_hoach, project.ket_qua_thuc_hien_ke_hoach FROM project INNER JOIN pic ON project.id = pic.project_id INNER JOIN users ON pic.pic = users.id INNER JOIN projects_types ON project.project_type = projects_types.id INNER JOIN priorities ON project.priority = priorities.id INNER JOIN projects_status ON project.project_status = projects_status.id INNER JOIN customers ON project.customer = customers.id WHERE project.week = ? AND project.project_type = ?", [week, type]);
            const result = JSON.parse(JSON.stringify(rows)) || [];
            for (const row of result) {
                row.muc_do_kha_thi || (row.muc_do_kha_thi = "");
            }
            // await Promise.allSettled(
            //   result.map(async (row: any) => {
            //     const [rows2] = await connection.execute(
            //       "SELECT users.display_name as display_name FROM users INNER JOIN users_roles ON users.id = users_roles.user INNER JOIN role ON users_roles.role = role.id INNER JOIN pic ON users.id = pic.pic INNER JOIN project ON pic.project_id = project.id WHERE project.id = ? AND role.name = 'ROLE_AM' LIMIT 1",
            //       [row.project_id]
            //     );
            //     row.display_name = rows2[0]?.display_name ?? "";
            //     data.push(row);
            //   })
            // );
            data = result;
        }
        // if (!data) {
        //   res.status(400).json({
        //     error_code: 5,
        //     err_desc: "Không có dữ liệu",
        //     error_detail: "",
        //   });
        //   return;
        // }
        // const re
        // console.log(data);
        connection.release();
        if (!(data === null || data === void 0 ? void 0 : data[0])) {
            res.status(200).json({
                error_code: 6,
                err_desc: "Không có dữ liệu",
                error_detail: "",
            });
            return;
        }
        for (let i = 0; i < data.length; i++) {
            data[i].stt = i + 1;
        }
        const newData = {};
        Object.keys(data[0]).forEach((key) => {
            newData[key] = [];
        });
        data.forEach((row) => {
            Object.keys(row).forEach((key) => {
                newData[key].push(row[key]);
            });
        });
        const { fileExportPath, exportFileName, validUntil } = yield excel.exportFile(data, type);
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
    }
    catch (error) {
        res.status(500).json({
            error_code: 1,
            err_desc: error.message,
            error_detail: error.stack,
        });
        (_a = connection === null || connection === void 0 ? void 0 : connection.release) === null || _a === void 0 ? void 0 : _a.call(connection);
    }
});
