import { Controller, Get, Post, Patch, Body, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../user/user.entity';
import { AbsenceStatus } from './absence.entity';
import { AbsenceService } from './absence.service';
import { CreateAbsenceDto } from './dto/create-absence.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('absences')
export class AbsenceController {
  constructor(private readonly service: AbsenceService) {}

  @Get()
  getAll() { return this.service.findAll(); }

  @Post()
  @Roles(Role.EMPLOYEE)
  create(@Req() req: { user: { userId: string } }, @Body() dto: CreateAbsenceDto) {
    return this.service.create(req.user.userId, dto);
  }

  @Patch(':id/approve')
  @Roles(Role.ADMIN)
  approve(@Param('id') id: string) {
    return this.service.updateStatus(id, AbsenceStatus.APPROVED);
  }

  @Patch(':id/reject')
  @Roles(Role.ADMIN)
  reject(@Param('id') id: string) {
    return this.service.updateStatus(id, AbsenceStatus.REJECTED);
  }
}
