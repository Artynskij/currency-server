import { IsNotEmpty } from 'class-validator';

export class CreateBankDto {
  @IsNotEmpty()
  readonly name: string;
  @IsNotEmpty()
  readonly logo: string;
  @IsNotEmpty()
  readonly codename: string;
  @IsNotEmpty()
  readonly idbank: number;
}
