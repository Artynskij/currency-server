import { PartialType } from '@nestjs/mapped-types';
import { CreateBankDto } from './create-bank.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateBankDto extends PartialType(CreateBankDto) {}

export class errorUpdate {
  @IsNotEmpty()
  message: string;
  @IsNotEmpty()
  error: string;
  @IsNotEmpty()
  obj: CreateBankDto;
}
