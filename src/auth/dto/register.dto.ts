import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Role } from '../../user/user.entity';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsEnum(Role)
  role!: Role;
}