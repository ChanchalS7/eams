import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateAbsenceDto {
  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @IsDateString()
  @IsNotEmpty()
  endDate!: string;

  @IsString()
  @IsNotEmpty()
  reason!: string;
}