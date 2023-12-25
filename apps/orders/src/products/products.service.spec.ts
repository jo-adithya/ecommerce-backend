import { Test, TestingModule } from "@nestjs/testing";

import { ProductsRepository } from "./products.repository";
import { ProductsService } from "./products.service";

describe("ProductsService", () => {
  let service: ProductsService;

  const mockProductsRepository: Partial<jest.Mocked<ProductsRepository>> = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: ProductsRepository, useValue: mockProductsRepository },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
