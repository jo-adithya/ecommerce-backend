import { Types } from "mongoose";

import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { ProductDocument } from "../models/product.schema";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

describe("ProductsController", () => {
  let controller: ProductsController;
  let mockProductsService: Partial<ProductsService>;
  let products: ProductDocument[];

  const mockProduct = {
    title: "Product #1",
    price: 20,
  };

  const findOne = (_id: string) => {
    const product = products.find((p) => p._id.toString() === _id);
    return product ? Promise.resolve(product) : Promise.reject(new NotFoundException());
  };

  beforeEach(async () => {
    mockProductsService = {
      create: jest.fn((createProductDto) => {
        const product = { _id: new Types.ObjectId(), ...createProductDto } as ProductDocument;
        products.push(product);
        return Promise.resolve(product);
      }),

      findAll: jest.fn(() => Promise.resolve(products)),

      findOne: jest.fn((_id) => findOne(_id)),

      update: jest.fn(async (_id, updateProductDto) => {
        const product = await findOne(_id);
        const updatedProduct = { ...product, ...updateProductDto } as ProductDocument;
        products = products.map((p) => (p._id.toString() === _id ? updatedProduct : p));
        return Promise.resolve(updatedProduct);
      }),

      delete: jest.fn(async (_id) => {
        const product = await findOne(_id);
        products = products.filter((p) => p._id.toString() !== _id);
        return Promise.resolve(product);
      }),
    };

    const module = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: mockProductsService }],
    }).compile();

    products = [];
    controller = module.get<ProductsController>(ProductsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a product", async () => {
      const product = await controller.create(mockProduct);

      expect(product._id).toBeDefined();
      expect(product.title).toEqual(mockProduct.title);
      expect(product.price).toEqual(mockProduct.price);
    });
  });

  describe("findAll", () => {
    it("should return an array of products", async () => {
      const product = await controller.create(mockProduct);
      const products = await controller.findAll();

      expect(products).toBeDefined();
      expect(products.length).toEqual(1);
      expect(products[0]).toEqual(product);
    });

    it("should return an empty array if there are no products", async () => {
      const products = await controller.findAll();
      expect(products).toEqual([]);
    });
  });

  describe("findOne", () => {
    it("should return a product", async () => {
      const product = await controller.create(mockProduct);
      const foundProduct = await controller.findOne(product._id.toString());

      expect(foundProduct).toBeDefined();
      expect(foundProduct).toEqual(product);
    });

    it("should throw an error if the product does not exist", async () => {
      await expect(controller.findOne(new Types.ObjectId().toString())).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("update", () => {
    it("should update a product", async () => {
      const product = await controller.create(mockProduct);
      const updateProductDto = { title: "Product #2", price: 30 };
      const updatedProduct = await controller.update(product._id.toString(), updateProductDto);

      expect(updatedProduct).toBeDefined();

      expect(updatedProduct._id).toEqual(product._id);
      expect(updatedProduct.title).toEqual(updateProductDto.title);
      expect(updatedProduct.price).toEqual(updateProductDto.price);
    });

    it("should throw an error if the product does not exist", async () => {
      await expect(
        controller.update(new Types.ObjectId().toString(), { title: "Product #2", price: 30 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("delete", () => {
    it("should delete a product", async () => {
      const product = await controller.create(mockProduct);
      expect(product).toBeDefined();
      expect(products).toHaveLength(1);

      const deletedProduct = await controller.delete(product._id.toString());

      expect(deletedProduct).toBeDefined();
      expect(deletedProduct).toEqual(product);
      expect(products).toHaveLength(0);
    });

    it("should throw an error if the product does not exist", async () => {});
  });
});
