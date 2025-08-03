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
exports.AbsenceRequest = exports.AbsenceStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
var AbsenceStatus;
(function (AbsenceStatus) {
    AbsenceStatus["PENDING"] = "PENDING";
    AbsenceStatus["APPROVED"] = "APPROVED";
    AbsenceStatus["REJECTED"] = "REJECTED";
})(AbsenceStatus || (exports.AbsenceStatus = AbsenceStatus = {}));
let AbsenceRequest = class AbsenceRequest {
};
exports.AbsenceRequest = AbsenceRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AbsenceRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    __metadata("design:type", user_entity_1.User)
], AbsenceRequest.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.Column)('date'),
    __metadata("design:type", Date)
], AbsenceRequest.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)('date'),
    __metadata("design:type", Date)
], AbsenceRequest.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AbsenceRequest.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', enum: AbsenceStatus, default: AbsenceStatus.PENDING }),
    __metadata("design:type", String)
], AbsenceRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AbsenceRequest.prototype, "createdAt", void 0);
exports.AbsenceRequest = AbsenceRequest = __decorate([
    (0, typeorm_1.Entity)()
], AbsenceRequest);
