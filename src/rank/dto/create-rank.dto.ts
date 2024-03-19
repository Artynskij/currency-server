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
  @IsNotEmpty()
  readonly type: string;
  @IsNotEmpty()
  readonly address: string;
  @IsNotEmpty()
  readonly coord: string;
}
export class errorCreate {
  message: string;
  obj: CreateRankDto;
  error: string;
  forExample: CreateRankDto;
}
