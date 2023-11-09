import { Test, TestingModule } from "@nestjs/testing";

import { ScryptService } from "./scrypt.service";

describe("ScryptService", () => {
	let service: ScryptService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ScryptService],
		}).compile();

		service = module.get<ScryptService>(ScryptService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
