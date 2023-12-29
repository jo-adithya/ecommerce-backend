import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class DecreaseProductQuantityDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
