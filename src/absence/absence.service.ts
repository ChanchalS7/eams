import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbsenceRequest, AbsenceStatus } from './absence.entity';
import { User } from '../user/user.entity';
import { CreateAbsenceDto } from './dto/create-absence.dto';

@Injectable()
export class AbsenceService {
  constructor(
    @InjectRepository(AbsenceRequest)
    private absenceRepo: Repository<AbsenceRequest>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<AbsenceRequest[]> {
    return this.absenceRepo.find({
      relations: ['employee'],
    });
  }

  async create(userId: string, dto: CreateAbsenceDto): Promise<AbsenceRequest> {
    const employee = await this.userRepo.findOne({ where: { id: userId } });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const absence = this.absenceRepo.create({
      ...dto,
      employee,
    });

    return this.absenceRepo.save(absence);
  }

  async updateStatus(id: string, status: AbsenceStatus): Promise<AbsenceRequest> {
    const absence = await this.absenceRepo.findOne({ where: { id }, relations: ['employee'] });
    if (!absence) {
      throw new NotFoundException('Absence request not found');
    }

    absence.status = status;
    return this.absenceRepo.save(absence);
  }
}