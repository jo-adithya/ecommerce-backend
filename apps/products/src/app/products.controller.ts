import { Controller, Get } from "@nestjs/common";

import { ProductsService } from "./products.service";

@Controller()
export class AppController {
	constructor(private readonly productsService: ProductsService) {}

	@Get()
	getData() {
		return this.productsService.getData();
	}
}
