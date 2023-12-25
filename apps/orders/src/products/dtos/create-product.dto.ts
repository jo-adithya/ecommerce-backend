import { IsNumber, IsPositive, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  title: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
