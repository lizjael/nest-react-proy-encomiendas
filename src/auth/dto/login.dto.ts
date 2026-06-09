import { IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  //Aca si el login tiene mas seguridad dependerá de su proyecto
  @IsEmail()
  email: string;
  @Transform(({ value }) => value.trim()) // Elimina espacios en blanco al inicio y al final
  @IsString()
  @MinLength(6)
  password: string;
}
