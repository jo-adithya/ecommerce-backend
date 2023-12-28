import { Expose } from "class-transformer";

export class Product {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  price: number;

  @Expose()
  quantity: string;
}
