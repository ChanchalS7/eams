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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.AbsenceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const absence_entity_1 = require("./absence.entity");
const user_entity_1 = require("../user/user.entity");
let AbsenceService = class AbsenceService {
    constructor(absenceRepo, userRepo) {
        this.absenceRepo = absenceRepo;
        this.userRepo = userRepo;
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.absenceRepo.find({
                relations: ['employee'],
            });
        });
    }
    create(userId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this.userRepo.findOne({ where: { id: userId } });
            if (!employee) {
                throw new common_1.NotFoundException('Employee not found');
            }
            const absence = this.absenceRepo.create(Object.assign(Object.assign({}, dto), { employee }));
            return this.absenceRepo.save(absence);
        });
    }
    updateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const absence = yield this.absenceRepo.findOne({ where: { id }, relations: ['employee'] });
            if (!absence) {
                throw new common_1.NotFoundException('Absence request not found');
            }
            absence.status = status;
            return this.absenceRepo.save(absence);
        });
    }
};
exports.AbsenceService = AbsenceService;
exports.AbsenceService = AbsenceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(absence_entity_1.AbsenceRequest)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AbsenceService);
