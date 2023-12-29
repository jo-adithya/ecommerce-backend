import { FilterQuery, Types } from "mongoose";

import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { Product, ProductDocument } from "../models/product.schema";
import { ProductCreatedPublisherService, ProductUpdatedPublisherService } from "../nats";
import { ProductsRepository } from "./products.repository";
import { ProductsService } from "./products.service";

describe("ProductsService", () => {
  let service: ProductsService;
  let products: ProductDocument[];
  let mockProductsRepository: Partial<ProductsRepository>;
  let mockProductCreatedPublisher: Partial<ProductCreatedPublisherService>;
  let mockProductUpdatedPublisher: Partial<ProductUpdatedPublisherService>;

  const mockProduct = { title: "Product #1", price: 20, quantity: 1 };

  const findOne = (filterQuery: FilterQuery<Product>) => {
    const product = products.find((p) => {
      return Object.entries(filterQuery).every(
        ([key, value]) => p[key as keyof ProductDocument].toString() === value,
      );
    });
    return product ? Promise.resolve(product) : Promise.reject(new NotFoundException());
  };

  beforeEach(async () => {
    mockProductsRepository = {
      create: jest.fn((createProductDto) => {
        const product = { ...createProductDto, _id: new Types.ObjectId() } as ProductDocument;
        products.push(product);
        return Promise.resolve(product);
      }),

      find: jest.fn(() => Promise.resolve(products)),

      findOne: jest.fn(findOne),

      findOneAndUpdate: jest.fn(async (filterQuery, updateQuery) => {
        const product = await findOne(filterQuery);
        const updatedProduct = { ...product, ...updateQuery.$set } as ProductDocument;
        products = products.map((p) =>
          p._id.toString() === product._id.toString() ? updatedProduct : p,
        );
        return Promise.resolve(updatedProduct);
      }),

      findOneAndDelete: jest.fn(async (filterQuery) => {
        const product = await findOne(filterQuery);
        products = products.filter((p) => p._id.toString() !== product._id.toString());
        return Promise.resolve(product);
      }),
    };

    mockProductCreatedPublisher = { publish: jest.fn() };
    mockProductUpdatedPublisher = { publish: jest.fn() };

    const app = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: ProductsRepository, useValue: mockProductsRepository },
        { provide: ProductCreatedPublisherService, useValue: mockProductCreatedPublisher },
        { provide: ProductUpdatedPublisherService, useValue: mockProductUpdatedPublisher },
      ],
    }).compile();

    products = [];
    service = app.get<ProductsService>(ProductsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a product", async () => {
      const product = await service.create(mockProduct);

      expect(product._id).toBeDefined();
      expect(product.title).toEqual(mockProduct.title);
      expect(product.price).toEqual(mockProduct.price);
      expect(mockProductCreatedPublisher.publish).toHaveBeenCalledWith({
        id: product._id.toString(),
        title: product.title,
        price: product.price,
        quantity: product.quantity,
      });
    });
  });

  describe("findAll", () => {
    it("should return an array of products", async () => {
      const product = await service.create(mockProduct);
      const products = await service.findAll();

      expect(products).toBeDefined();
      expect(products.length).toEqual(1);
      expect(products[0]).toEqual(product);
    });

    it("should return an empty array if there are no products", async () => {
      const products = await service.findAll();
      expect(products).toEqual([]);
    });
  });

  describe("findOne", () => {
    it("should return a product", async () => {
      const product = await service.create(mockProduct);
      const foundProduct = await service.findOne(product._id.toString());

      expect(foundProduct).toBeDefined();
      expect(foundProduct).toEqual(product);
    });

    it("should throw an error if the product does not exist", async () => {
      await expect(service.findOne("1")).rejects.toThrow(NotFoundException);
    });
  });

  describe("update", () => {
    it("should update a product", async () => {
      const product = await service.create(mockProduct);
      const updateProductDto = { title: "Product #2", price: 30, quantity: 2 };
      const updatedProduct = await service.update(product._id.toString(), updateProductDto);

      expect(updatedProduct).toBeDefined();
      expect(updatedProduct.title).toEqual(updateProductDto.title);
      expect(updatedProduct.price).toEqual(updateProductDto.price);

      expect(mockProductUpdatedPublisher.publish).toHaveBeenCalledWith({
        id: product._id.toString(),
        title: updatedProduct.title,
        price: updatedProduct.price,
        quantity: updatedProduct.quantity,
      });
    });

    it("should throw an error if the product does not exist", async () => {
      await expect(
        service.update("1", { title: "Product #2", price: 20, quantity: 1 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("delete", () => {
    it("should delete a product", async () => {
      const product = await service.create(mockProduct);
      expect(products).toHaveLength(1);

      const deletedProduct = await service.delete(product._id.toString());

      expect(deletedProduct).toBeDefined();
      expect(deletedProduct).toEqual(product);
      expect(products).toHaveLength(0);
    });

    it("should throw an error if the product does not exist", async () => {
      await expect(service.delete("1")).rejects.toThrow(NotFoundException);
    });
  });
});
