"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const typeorm_1 = require("typeorm");
const Customer_1 = require("./Customer");
const PIC_1 = require("./PIC");
const ProjectStatus_1 = require("./ProjectStatus");
const ProjectType_1 = require("./ProjectType");
let Project = class Project extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Project.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => ProjectType_1.ProjectType),
    (0, typeorm_1.JoinColumn)({ name: "project_type" }),
    __metadata("design:type", Promise)
], Project.prototype, "project_type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => ProjectStatus_1.ProjectStatus),
    (0, typeorm_1.JoinColumn)({ name: "project_status" }),
    __metadata("design:type", Promise)
], Project.prototype, "project_status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => Customer_1.Customer),
    (0, typeorm_1.JoinColumn)({ name: "customer" }),
    __metadata("design:type", Promise)
], Project.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Project.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Project.prototype, "week", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Project.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "projects_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "ma_so_ke_toan", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "tong_muc_dau_tu_du_kien", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "hinh_thuc_dau_tu", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Project.prototype, "muc_do_kha_thi", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "phan_tich_SWOT", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "pham_vi_cung_cap", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Project.prototype, "tong_gia_tri_thuc_te", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Project.prototype, "DAC", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Project.prototype, "PAC", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Project.prototype, "FAC", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Project.prototype, "so_tien_tam_ung", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Project.prototype, "ke_hoach_tam_ung", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Project.prototype, "so_tien_DAC", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Project.prototype, "ke_hoach_thanh_toan_DAC", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Project.prototype, "thuc_te_thanh_toan_DAC", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Project.prototype, "so_tien_PAC", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Project.prototype, "ke_hoach_thanh_toan_PAC", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Project.prototype, "thuc_te_thanh_toan_PAC", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Project.prototype, "so_tien_FAC", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Project.prototype, "ke_hoach_thanh_toan_FAC", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Project.prototype, "thuc_te_thanh_toan_FAC", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "tinh_trang_va_ke_hoach_chi_tiet", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "ke_hoach", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "general_issue", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "solution", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "ket_qua_thuc_hien_ke_hoach", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "interactive", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Project.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => PIC_1.PIC, (pic) => pic.project),
    (0, typeorm_1.JoinColumn)({ name: "project_id" }),
    __metadata("design:type", Promise)
], Project.prototype, "pics", void 0);
Project = __decorate([
    (0, typeorm_1.Entity)({
        name: "project",
    })
], Project);
exports.Project = Project;
