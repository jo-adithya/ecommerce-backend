import { Test, TestingModule } from "@nestjs/testing";

import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

describe("ProductsController", () => {
	let app: TestingModule;

	beforeAll(async () => {
		app = await Test.createTestingModule({
			controllers: [ProductsController],
			providers: [ProductsService],
		}).compile();
	});

	describe("getData", () => {
		it('should return "Hello API"', () => {
			const appController = app.get<ProductsController>(ProductsController);
			expect(appController.getData()).toEqual({ message: "Hello API" });
		});
	});
});
