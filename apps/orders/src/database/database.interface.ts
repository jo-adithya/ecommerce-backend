import { Generated } from "kysely";

import { Order, Product } from "../models";

type GeneratedId<T> = Omit<T, "id"> & { id: Generated<string> };

export interface Database {
  product: GeneratedId<Product>;
  order: GeneratedId<Order>;
}
