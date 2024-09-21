import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class addedBookDto{
  @ApiProperty()
  @Type(() => String)
  @IsNotEmpty({ message: 'Code tidak boleh kosong' })
  code: string;
  
  @ApiProperty()
  @Type(() => String)
  @IsNotEmpty({ message: 'Judul tidak boleh kosong' })
  title: string;

  @ApiProperty()
  @Type(() => String)
  @IsNotEmpty({ message: 'Pengarang tidak boleh kosong' })
  author: string;
  
  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty({ message: 'Pengarang tidak boleh kosong' })
  stok: number;
}