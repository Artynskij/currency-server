import { IsNotEmpty } from 'class-validator';

export class CreateRankDto {
  @IsNotEmpty()
  readonly codename: string;
  @IsNotEmpty()
  readonly selrate: string;
  @IsNotEmpty()
  readonly seliso: string;
  @IsNotEmpty()
  readonly buyrate: string;
  @IsNotEmpty()
  readonly buyiso: string;
  @IsNotEmpty()
  readonly quantity: number;
  @IsNotEmpty()
  readonly name: string;
}
