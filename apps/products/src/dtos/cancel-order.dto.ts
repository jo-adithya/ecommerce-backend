import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CancelOrderDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
