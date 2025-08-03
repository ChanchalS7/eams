import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbsenceController } from './absence.controller';
import { AbsenceService } from './absence.service';
import { AbsenceRequest } from './absence.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AbsenceRequest, User])],
  controllers: [AbsenceController],
  providers: [AbsenceService],
})
export class AbsenceModule {}