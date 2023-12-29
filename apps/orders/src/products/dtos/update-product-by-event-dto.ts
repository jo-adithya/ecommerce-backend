import { IsNotEmpty, IsString } from "class-validator";

import { CreateProductDto } from "./create-product.dto";

export class UpdateProductByEventDto extends CreateProductDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
