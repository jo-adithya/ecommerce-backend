import { IsNotEmpty, IsString } from "class-validator";

export class GetProductByIdDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
