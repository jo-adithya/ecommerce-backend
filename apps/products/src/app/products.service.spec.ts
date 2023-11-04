import { Test } from "@nestjs/testing";

import { ProductsService } from "./products.service";

describe("ProductsService", () => {
	let service: ProductsService;

	beforeAll(async () => {
		const app = await Test.createTestingModule({
			providers: [ProductsService],
		}).compile();

		service = app.get<ProductsService>(ProductsService);
	});

	describe("getData", () => {
		it('should return "Hello API"', () => {
			expect(service.getData()).toEqual({ message: "Hello API" });
		});
	});
});
