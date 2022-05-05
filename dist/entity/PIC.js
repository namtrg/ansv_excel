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
exports.PIC = void 0;
const typeorm_1 = require("typeorm");
const Project_1 = require("./Project");
const User_1 = require("./User");
let PIC = class PIC extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PIC.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_1.Project, (project) => project.pics),
    (0, typeorm_1.JoinColumn)({
        name: "project_id",
    }),
    __metadata("design:type", Promise)
], PIC.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.pics),
    (0, typeorm_1.JoinColumn)({
        name: "pic",
    }),
    __metadata("design:type", Promise)
], PIC.prototype, "pics", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PIC.prototype, "note", void 0);
PIC = __decorate([
    (0, typeorm_1.Entity)({
        name: "pic",
    })
], PIC);
exports.PIC = PIC;
