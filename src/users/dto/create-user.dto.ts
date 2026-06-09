import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../common/enums/rol.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'juan@empresa.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'MiPassword123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: Role, default: Role.USER })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
