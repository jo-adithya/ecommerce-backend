import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "@nx-micro-ecomm/server/auth";

import { CreateProductDto } from "../dtos/create-product.dto";
import { UpdateProductDto } from "../dtos/update-product.dto";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@UseGuards(JwtAuthGuard)
	@Post()
	async create(@Body() createProductDto: CreateProductDto) {
		return this.productsService.create(createProductDto);
	}

	@Get()
	async findAll() {
		return this.productsService.findAll();
	}

	@Get(":id")
	async findOne(@Param("id") id: string) {
		return this.productsService.findOne(id);
	}

	@Patch(":id")
	async update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
		return this.productsService.update(id, updateProductDto);
	}

	@Delete(":id")
	async delete(@Param("id") id: string) {
		return this.productsService.delete(id);
	}

	@Get()
	getData() {
		return this.productsService.getData();
	}
}
