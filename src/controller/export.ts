const excel = require("../helpers/excel");
import { Request, Response } from "express";
import { PoolConnection } from "mysql2/promise";
import { pool } from "../db";
import { htmlToText } from "html-to-text";

function addZero(number: number): string {
  return number < 10 ? "0" + number : number.toString();
}

function convertDateToString(date: Date): string {
  const day = addZero(date.getDate());
  const month = addZero(date.getMonth() + 1);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
const isNumeric = (num: any) =>
  (typeof num === "number" || (typeof num === "string" && num.trim() !== "")) &&
  !isNaN(num as number);

export default async (req: Request, res: Response) => {
  // const data = req.body.data;
  // 1: triển khai
  // 2 Viên thông
  // 3 chuyển đổi số
  let connection: PoolConnection;
  try {
    const { type, week, username } = req.body;
    console.log({ type, week, username });

    if (!isNumeric(type) || !isNumeric(week)) {
      res.status(400).json({
        error_code: 1,
        err_desc: "Invalid input: type hoặc week không hợp lệ",
        message: "Invalid input: type hoặc week không hợp lệ",
        error_detail: "",
      });
      return;
    }
    if (![1, 2, 3].includes(+type)) {
      res.status(400).json({
        error_code: 6,
        err_desc: "Type phải là 1, 2 hoặc 3",
        message: "Type phải là 1, 2 hoặc 3",
        error_detail: "",
      });
      return;
    }
    connection = await pool.getConnection();
    let data = [];

    if (+type === 1) {
      let params = [week, type];
      if (username) params = [...params, username];
      const [rows, fields] = await connection.execute(
        `SELECT project.id, projects_types.name AS type, priorities.name AS priority, projects_status.name AS status, customers.name AS customer, project.week, project.year, project.projects_id, project.ma_so_ke_toan, project.name, project.pham_vi_cung_cap, project.tong_gia_tri_thuc_te, project.DAC, project.FAC, project.PAC, project.so_tien_tam_ung, project.ke_hoach_tam_ung, project.so_tien_DAC, project.ke_hoach_thanh_toan_DAC, project.thuc_te_thanh_toan_DAC, project.so_tien_PAC, project.ke_hoach_thanh_toan_PAC, project.thuc_te_thanh_toan_PAC, project.so_tien_FAC, project.ke_hoach_thanh_toan_FAC, project.thuc_te_thanh_toan_FAC, project.ke_hoach, project.general_issue, project.solution, project.ket_qua_thuc_hien_ke_hoach 
        FROM project 
        INNER JOIN projects_types ON project.project_type = projects_types.id 
        INNER JOIN priorities ON project.priority = priorities.id 
        INNER JOIN projects_status ON project.project_status = projects_status.id 
        INNER JOIN customers ON project.customer = customers.id 
        INNER JOIN pic on pic.project_id = project.id
        INNER JOIN users on users.id = pic.pic
        WHERE project.week = ? AND project.project_type = ? ` +
          (username ? `AND users.username = ?` : ""),
        params
      );

      for (let i = 0; i < (rows as any)?.length || 0; i++) {
        const row = (rows as any)?.[i];
        if (row.FAC?.getTime) {
          const date = new Date(row.FAC);
          row.FAC = convertDateToString(date);
        }
        if (row.ke_hoach_thanh_toan_FAC?.getTime) {
          const date = new Date(row.ke_hoach_thanh_toan_FAC);
          row.ke_hoach_thanh_toan_FAC = convertDateToString(date);
        }
        if (row.thuc_te_thanh_toan_FAC?.getTime) {
          const date = new Date(row.thuc_te_thanh_toan_FAC);
          row.thuc_te_thanh_toan_FAC = convertDateToString(date);
        }
        if (row.DAC?.getTime) {
          const date = new Date(row.DAC);
          row.DAC = convertDateToString(date);
        }
        if (row.ke_hoach_thanh_toan_DAC?.getTime) {
          const date = new Date(row.ke_hoach_thanh_toan_DAC);
          row.ke_hoach_thanh_toan_DAC = convertDateToString(date);
        }
        if (row.thuc_te_thanh_toan_DAC?.getTime) {
          const date = new Date(row.thuc_te_thanh_toan_DAC);
          row.thuc_te_thanh_toan_DAC = convertDateToString(date);
        }
        if (row.PAC?.getTime) {
          const date = new Date(row.PAC);
          row.PAC = convertDateToString(date);
        }
        if (row.ke_hoach_thanh_toan_PAC?.getTime) {
          const date = new Date(row.ke_hoach_thanh_toan_PAC);
          row.ke_hoach_thanh_toan_PAC = convertDateToString(date);
        }
        if (row.thuc_te_thanh_toan_PAC?.getTime) {
          const date = new Date(row.thuc_te_thanh_toan_PAC);
          row.thuc_te_thanh_toan_PAC = convertDateToString(date);
        }
      }

      const result = JSON.parse(JSON.stringify(rows));

      for (const row of result) {
        row.tong_gia_tri_thuc_te ||= "";
        row.so_tien_DAC ||= "";
        row.so_tien_FAC ||= "";
        row.so_tien_PAC ||= "";
        
        [
          "pham_vi_cung_cap",
          "ke_hoach",
          "general_issue",
          "solution",
          "ket_qua_thuc_hien_ke_hoach",
        ].forEach((it) => {
          const test = htmlToText(row[it]);
          row[it] = test;
        });
      }
      await Promise.allSettled(
        result.map(async (row) => {
          const [rows2] = await connection.execute(
            "SELECT users.display_name as display_name, role.name as role_name FROM users INNER JOIN users_roles ON users.id = users_roles.user INNER JOIN role ON users_roles.role = role.id INNER JOIN pic ON users.id = pic.pic INNER JOIN project ON pic.project_id = project.id WHERE project.id = ?",
            [row.id]
          );

          const AM = (rows2 as [any]).find(
            (row2) => row2.role_name === "ROLE_AM"
          )?.display_name;
          const PM = (rows2 as [any]).find(
            (row2) => row2.role_name === "ROLE_PM"
          )?.display_name;
          row.AM = AM ?? "";
          row.PM = PM ?? "";
          data.push(row);
        })
      );
      // console.log(data);
    } else if (+type === 2 || +type === 3) {
      const [rows] = await connection.execute(
        "SELECT project.id AS project_id, users.display_name AS pic_name, projects_types.name AS project_type, priorities.name AS priority, projects_status.name AS project_status, customers.name, project.week, project.year, project.name, project.description, project.tong_muc_dau_tu_du_kien, project.hinh_thuc_dau_tu, project.muc_do_kha_thi, project.phan_tich_SWOT, project.general_issue, project.ke_hoach, project.ket_qua_thuc_hien_ke_hoach FROM project INNER JOIN pic ON project.id = pic.project_id INNER JOIN users ON pic.pic = users.id INNER JOIN projects_types ON project.project_type = projects_types.id INNER JOIN priorities ON project.priority = priorities.id INNER JOIN projects_status ON project.project_status = projects_status.id INNER JOIN customers ON project.customer = customers.id WHERE project.week = ? AND project.project_type = ?",
        [week, type]
      );

      const result = JSON.parse(JSON.stringify(rows)) || [];

      for (const r in result) {
        const row = result[r];
        row.muc_do_kha_thi ||= "";
        [
          "description",
          "ke_hoach",
          "ket_qua_thuc_hien_ke_hoach",
        ].forEach((it) => {
          const test = htmlToText(row[it]);
          row[it] = test;
        });
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

    // console.log(data);
    
    // if (!data) {
    //   res.status(400).json({
    //     error_code: 5,
    //     err_desc: "Không có dữ liệu",
    //     error_detail: "",
    //   });
    //   return;
    // }

    connection.destroy();

    if (!data?.[0]) {
      res.status(200).json({
        error_code: 6,
        err_desc: "Không có dữ liệu",
        message: "Không có dữ liệu",
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

    const { fileExportPath, exportFileName, validUntil } =
      await excel.exportFile(data, type);
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
  } catch (error) {
    res.status(500).json({
      error_code: 1,
      err_desc: error.message,
      error_detail: error.stack,
    });
    connection?.destroy?.();
  }
};
