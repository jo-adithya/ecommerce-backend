import { Test, TestingModule } from "@nestjs/testing";

import { OrderCreatedListenerService } from "./order-created-listener.service";

describe("OrderCreatedListenerService", () => {
  let service: OrderCreatedListenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderCreatedListenerService],
    }).compile();

    service = module.get<OrderCreatedListenerService>(OrderCreatedListenerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
