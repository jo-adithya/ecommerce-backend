import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { ProductsRepository } from "./products.repository";
import { ProductsService } from "./products.service";

describe("ProductsService", () => {
  let service: ProductsService;

  const mockProductsRepository: Partial<jest.Mocked<ProductsRepository>> = {
    createProduct: jest.fn((product) => Promise.resolve(product)),
    getProductById: jest.fn(),
    updateProduct: jest.fn(),
  };
  const mockProduct = { id: "1", title: "Product #1", price: 20, quantity: 1 };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: ProductsRepository, useValue: mockProductsRepository },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createProduct", () => {
    it("should create a product", async () => {
      const product = await service.createProduct(mockProduct);
      expect(product).toEqual(mockProduct);
    });
  });

  describe("getProductById", () => {
    it("should get a product by id", async () => {
      mockProductsRepository.getProductById.mockResolvedValueOnce(mockProduct);
      const product = await service.getProductById({ id: mockProduct.id });
      expect(product).toEqual(mockProduct);
    });

    it("should throw an error if product not found", async () => {
      mockProductsRepository.getProductById.mockRejectedValueOnce(new NotFoundException());
      await expect(service.getProductById({ id: mockProduct.id })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("updateProduct", () => {
    it("should update a product", async () => {
      const mockUpdateProductDto = {
        id: mockProduct.id,
        title: "Product #1",
        price: 20,
        quantity: 1,
      };
      mockProductsRepository.updateProduct.mockResolvedValueOnce(mockUpdateProductDto);
      const product = await service.updateProduct(mockUpdateProductDto);
      expect(product).toEqual(mockUpdateProductDto);
    });

    it("should throw an error if product not found", async () => {
      const mockUpdateProductDto = { id: "1", title: "Product #1", price: 20, quantity: 1 };
      mockProductsRepository.updateProduct.mockRejectedValueOnce(new NotFoundException());
      await expect(service.updateProduct(mockUpdateProductDto)).rejects.toThrow(NotFoundException);
    });
  });
});
