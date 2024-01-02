import { Test, TestingModule } from "@nestjs/testing";

import { ExpirationCompletePublisherService } from "./expiration-complete-publisher.service";

describe("ExpirationCompletePublisherService", () => {
  let service: ExpirationCompletePublisherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpirationCompletePublisherService],
    }).compile();

    service = module.get<ExpirationCompletePublisherService>(ExpirationCompletePublisherService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
