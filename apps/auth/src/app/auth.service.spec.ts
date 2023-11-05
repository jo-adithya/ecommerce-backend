import { Test } from "@nestjs/testing";

import { AuthService } from "./auth.service";

describe("AuthService", () => {
	let service: AuthService;

	beforeAll(async () => {
		const app = await Test.createTestingModule({
			providers: [AuthService],
		}).compile();

		service = app.get<AuthService>(AuthService);
	});

	describe("getData", () => {
		it('should return "Hello API"', () => {
			expect(service.getData()).toEqual({ message: "Hello API" });
		});
	});
});
