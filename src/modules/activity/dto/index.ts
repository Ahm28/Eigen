import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString } from "class-validator";

export class BorrowBookDto {
  @ApiProperty()
  @Type(() => String)
  code_book: string;
  
  @ApiProperty()
  @Type(() => String)
  code_user: string;

  @ApiProperty()
  @IsDateString()
  date_borrow: string;
}

export class ReturnBookDto {
  @ApiProperty()
  @Type(() => String)
  code_book: string;
  
  @ApiProperty()
  @Type(() => String)
  code_user: string;

  @ApiProperty()
  @IsDateString()
  date_return: string;
}