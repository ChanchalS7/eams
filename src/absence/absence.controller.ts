@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('absences')
export class AbsenceController {
  constructor(private readonly service: AbsenceService) {}

  @Get()
  getAll() { return this.service.findAll(); }

  @Post()
  @Roles(Role.EMPLOYEE)
  create(@Req() req, @Body() dto: CreateAbsenceDto) {
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
