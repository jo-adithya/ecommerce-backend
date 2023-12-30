import { Kysely } from "kysely";

import { Injectable, Logger, NotFoundException } from "@nestjs/common";

import { InjectKysely } from "@nx-micro-ecomm/server/kysely";

import { Database } from "../database";
import { Product } from "../models";
import {
  CreateProductDto,
  DecreaseProductQuantityDto,
  GetProductByIdDto,
  UpdateProductVersionDto,
} from "./dtos";
import { UpdateProductByEventDto } from "./dtos/update-product-by-event-dto";

@Injectable()
export class ProductsRepository {
  private readonly logger = new Logger(ProductsRepository.name);

  constructor(@InjectKysely() private readonly db: Kysely<Database>) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> | never {
    this.logger.log(`Creating Product: ${JSON.stringify(createProductDto)}`);
    return this.db
      .insertInto("product")
      .values(createProductDto)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async getProductById(getProductByIdDto: GetProductByIdDto): Promise<Product> | never {
    this.logger.debug(`Getting Product by id: ${JSON.stringify(getProductByIdDto)}`);
    return this.db
      .selectFrom("product")
      .selectAll()
      .where("id", "=", getProductByIdDto.id)
      .executeTakeFirstOrThrow(() => new NotFoundException("Product not found"));
  }

  async updateProductByEvent(updateProductDto: UpdateProductByEventDto): Promise<Product> | never {
    this.logger.log(`Updating Product: ${JSON.stringify(updateProductDto)}`);
    return this.db
      .updateTable("product")
      .set(updateProductDto)
      .where("id", "=", updateProductDto.id)
      .where("version", "=", updateProductDto.version - 1)
      .returningAll()
      .executeTakeFirstOrThrow(() => new NotFoundException("Product not found"));
  }

  async decreaseProductQuantity(
    decreaseProductQuantityDto: DecreaseProductQuantityDto,
  ): Promise<Product> | never {
    this.logger.log(`Decreasing product quantity: ${JSON.stringify(decreaseProductQuantityDto)}`);
    return this.db
      .updateTable("product")
      .set((eb) => ({
        quantity: eb("quantity", "-", decreaseProductQuantityDto.quantity),
      }))
      .where("id", "=", decreaseProductQuantityDto.id)
      .returningAll()
      .executeTakeFirstOrThrow(() => new NotFoundException("Product not found"));
  }

  async updateProductVersion(
    updateProductVersionDto: UpdateProductVersionDto,
  ): Promise<Product> | never {
    this.logger.log(`Updating product version: ${JSON.stringify(updateProductVersionDto)}`);
    return this.db
      .updateTable("product")
      .set({ version: updateProductVersionDto.version })
      .where("id", "=", updateProductVersionDto.id)
      .returningAll()
      .executeTakeFirstOrThrow(() => new NotFoundException("Product not found"));
  }
}
