import { Test, TestingModule } from "@nestjs/testing";

import { AppController } from "./products.controller";
import { ProductsService } from "./products.service";

describe("ProductsController", () => {
	let app: TestingModule;

	beforeAll(async () => {
		app = await Test.createTestingModule({
			controllers: [AppController],
			providers: [ProductsService],
		}).compile();
	});

	describe("getData", () => {
		it('should return "Hello API"', () => {
			const appController = app.get<AppController>(AppController);
			expect(appController.getData()).toEqual({ message: "Hello API" });
		});
	});
});
