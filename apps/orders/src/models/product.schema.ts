import { Output, minValue, number, object, string } from "valibot";

export const ProductSchema = object({
  id: string(),
  title: string(),
  price: number([minValue(1)]),
  quantity: number([minValue(1)]),
  version: number(),
});

export type Product = Output<typeof ProductSchema>;
