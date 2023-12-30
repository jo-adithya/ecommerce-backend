import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class UpdateProductVersionDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  @IsPositive()
  version: number;
}
