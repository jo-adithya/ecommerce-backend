import { UnprocessableEntityException } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { CreateUserDto } from "../dtos";
import { User } from "../models/user.schema";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
	let controller: AuthController;
	let fakeAuthService: Partial<AuthService>;

	const email = "test@test.com";
	const password = "password";

	beforeEach(async () => {
		fakeAuthService = {
			signIn: () => Promise.resolve({ accessToken: "accessToken", refreshToken: "refreshToken" }),
			signUp: (createUserDto: CreateUserDto) => Promise.resolve({ ...createUserDto } as User),
		};

		const app = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [{ provide: AuthService, useValue: fakeAuthService }],
		}).compile();

		controller = app.get<AuthController>(AuthController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	describe("signIn", () => {
		it("should return tokens", async () => {
			const response = {
				cookie: function (key: string, value: string, options: any) {
					this.cookies[key] = value;
				},
				cookies: {},
			};

			const user = await controller.signIn({ email, password } as User, response as any);
			expect(user.email).toEqual(email);
			expect(user.password).toEqual(password);
			expect(response.cookies["accessToken"]).toEqual("accessToken");
			expect(response.cookies["refreshToken"]).toEqual("refreshToken");
		});
	});

	describe("signUp", () => {
		it("should return user", async () => {
			const user = await controller.signUp({ email, password } as User);
			expect(user.email).toEqual(email);
			expect(user.password).toEqual(password);
		});

		it("should return user if email already exists", async () => {
			fakeAuthService.signUp = () =>
				Promise.reject(new UnprocessableEntityException("Email already exists."));

			await expect(controller.signUp({ email, password } as User)).rejects.toThrow(
				UnprocessableEntityException,
			);
		});
	});
});
