import { IsNumber, IsPositive, IsString } from "class-validator";

export class CreateOrderDto {
  @IsString()
  productId: string;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
