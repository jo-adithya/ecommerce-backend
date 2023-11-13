import { FlattenMaps, Types } from "mongoose";

import { NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";

import { jwtConfig } from "@nx-micro-ecomm/server/config";

import { CreateUserDto } from "../dtos";
import { GetUserByEmailDto } from "../dtos/get-user-by-email.dto";
import { HashingService } from "../hashing";
import { User } from "../models/user.schema";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
	let service: AuthService;
	let fakeUsersService: Partial<UsersService>;
	let fakeHashingService: Partial<HashingService>;
	let users: User[];

	const email = "test@test.com";
	const password = "password";

	beforeEach(async () => {
		users = [];
		fakeUsersService = {
			create: (createUserDto: CreateUserDto) => {
				const existingUser = users.find((user) => user.email === createUserDto.email);
				if (existingUser) {
					return Promise.reject(new UnprocessableEntityException("Email already exists."));
				}

				const user = {
					_id: new Types.ObjectId(),
					...createUserDto,
				} as FlattenMaps<User>;
				users.push(user);

				return Promise.resolve(user);
			},
			findByEmail: (getUserByEmailDto: GetUserByEmailDto) => {
				const user = users.find((user) => user.email === getUserByEmailDto.email);
				return user ? Promise.resolve(user) : Promise.reject(new NotFoundException());
			},
		};
		fakeHashingService = {
			hash: () => Promise.resolve("salt:hash"),
			compare: (password: string, encrypted: string) => Promise.resolve(password === encrypted),
		};
		const fakeJwtService: Partial<JwtService> = {
			signAsync: () => Promise.resolve("token"),
		};

		const app = await Test.createTestingModule({
			providers: [
				AuthService,
				{ provide: UsersService, useValue: fakeUsersService },
				{ provide: HashingService, useValue: fakeHashingService },
				{ provide: JwtService, useValue: fakeJwtService },
				{
					provide: jwtConfig.KEY,
					useValue: {
						secret: "test-secret",
						accessTokenTtl: 3600,
						refreshTokenTtl: 86400,
						issuer: "test-issuer",
						audience: "test-audience",
					},
				},
			],
		}).compile();

		service = app.get<AuthService>(AuthService);
	});

	it("should create a new instacnce of AuthService", async () => {
		expect(service).toBeDefined();
	});

	describe("signUp", () => {
		it("should create a new user with salted and hashed password", async () => {
			const user = await service.signUp({ email, password });

			expect(user.email).toEqual(email);
			expect(user.password).not.toEqual(password);
			const [salt, hash] = user.password.split(":");
			expect(salt).toBeDefined();
			expect(hash).toBeDefined();
		});

		it("should throw if user already exists", async () => {
			await service.signUp({ email, password });
			await expect(service.signUp({ email, password })).rejects.toThrow(
				UnprocessableEntityException,
			);
		});
	});

	describe("verifyUser", () => {
		it("should throw if no user is found", async () => {
			await expect(service.verifyUser(email, password)).rejects.toThrow(NotFoundException);
		});

		it("should throw if password is invalid", async () => {
			fakeHashingService.hash = (password: string) => Promise.resolve(password);
			await service.signUp({ email, password });
			await expect(service.verifyUser(email, "invalid")).rejects.toThrow();
		});

		it("should return the user if password is valid", async () => {
			fakeHashingService.hash = (password: string) => Promise.resolve(password);
			await service.signUp({ email, password });
			const user = await service.verifyUser(email, password);

			expect(user.email).toEqual(email);
			expect(user.password).toEqual(password);
		});
	});
});
