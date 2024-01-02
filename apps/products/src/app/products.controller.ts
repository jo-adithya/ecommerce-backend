import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "@nx-micro-ecomm/server/auth";

import { CreateProductDto, UpdateProductDto } from "../dtos";
import { ProductDocument } from "../models/product.schema";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<ProductDocument> | never {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(): Promise<ProductDocument[]> {
    return this.productsService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<ProductDocument> | never {
    return this.productsService.findOne(id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument> | never {
    return this.productsService.update(id, { $set: updateProductDto });
  }

  @Delete(":id")
  async delete(@Param("id") id: string): Promise<ProductDocument> | never {
    return this.productsService.delete(id);
  }
}
