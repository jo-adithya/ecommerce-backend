import { Expose } from "class-transformer";

export class ProductDto {
  @Expose({ name: "_id" })
  id: string;

  @Expose()
  title: string;

  @Expose()
  price: number;

  @Expose()
  quantity: number;
}
