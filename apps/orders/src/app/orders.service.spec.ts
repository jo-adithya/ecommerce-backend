import { Test } from "@nestjs/testing";

import { OrdersService } from "./orders.service";

describe("OrdersService", () => {
  let service: OrdersService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [OrdersService],
    }).compile();

    service = app.get<OrdersService>(OrdersService);
  });

  describe("getData", () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: "Hello API" });
    });
  });
});
