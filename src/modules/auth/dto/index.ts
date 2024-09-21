import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";


export class RegistrationDto{
  @ApiProperty()
  @Type(() => String)
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  @MaxLength(60, { message: 'Nama harus diisi maksimal 60 karakter' })
  @MinLength(3, { message: 'Nama harus diisi minimal 3 karakter' })
  name: string;
  
  @ApiProperty()
  @Type(() => String)
  @IsEmail({}, { message: 'Format email salah' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  @MaxLength(60, { message: 'Email harus diisi maksimal 60 karakter' })
  email: string;

  @ApiProperty()
  @Type(() => String)
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @MaxLength(60, { message: 'Password harus diisi maksimal 60 karakter' })
  @MinLength(7, { message: 'Password harus diisi minimal 7 karakter' })
  password: string;
}

export class LoginDto{
  @ApiProperty()
  @Type(() => String)
  @IsEmail({}, { message: 'Format email salah' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  @MaxLength(60, { message: 'Email harus diisi maksimal 60 karakter' })
  email: string;

  @ApiProperty()
  @Type(() => String)
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @MaxLength(60, { message: 'Password harus diisi maksimal 60 karakter' })
  @MinLength(7, { message: 'Password harus diisi minimal 7 karakter' })
  password: string;
}