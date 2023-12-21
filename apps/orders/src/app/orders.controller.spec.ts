import { Test, TestingModule } from "@nestjs/testing";

import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

describe("OrdersController", () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrdersService],
    }).compile();
  });

  describe("getData", () => {
    it('should return "Hello API"', () => {
      const appController = app.get<OrdersController>(OrdersController);
      expect(appController.getData()).toEqual({ message: "Hello API" });
    });
  });
});
