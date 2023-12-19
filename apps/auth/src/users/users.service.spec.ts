import { Types } from "mongoose";

import { NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import type { UserDocument } from "../models/user.schema";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";

type UserKey = keyof UserDocument;

describe("UsersService", () => {
  let service: UsersService;
  let users: UserDocument[];
  let mockUsersRepository: Partial<UsersRepository>;

  const mockUser = { email: "email@gmail.com", password: "password" };

  beforeEach(async () => {
    // Initialize mock fns
    mockUsersRepository = {
      create: jest.fn((createUserDto) => {
        const existingUser = users.find((user) => user.email === createUserDto.email);
        if (existingUser) {
          return Promise.reject(new UnprocessableEntityException("Email already exists."));
        }

        const user = { ...createUserDto, _id: new Types.ObjectId() } as UserDocument;
        users.push(user);
        return Promise.resolve(user);
      }),

      find: jest.fn(() => Promise.resolve(users)),

      findOne: jest.fn((filterQuery) => {
        const user = users.find((p) => {
          return Object.entries(filterQuery).every(
            ([key, value]) => p[key as UserKey].toString() === value,
          );
        });
        return user ? Promise.resolve(user) : Promise.reject(new NotFoundException());
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: UsersRepository, useValue: mockUsersRepository }],
    }).compile();

    users = [];
    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("shoould create a user", async () => {
      const user = await service.create(mockUser);
      expect(user).toBeDefined();
      expect(user.email).toEqual(mockUser.email);
      expect(user.password).toEqual(mockUser.password);
      expect(user._id).toBeDefined();
    });

    it("should throw an error if the email already exists", async () => {
      await service.create(mockUser);
      await expect(service.create(mockUser)).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe("findAll", () => {
    it("should return an empty array", async () => {
      const foundUsers = await service.findAll();

      expect(foundUsers).toBeDefined();
      expect(foundUsers.length).toEqual(0);
    });

    it("should return an array of users", async () => {
      const user = await service.create(mockUser);
      const foundUsers = await service.findAll();

      expect(foundUsers).toBeDefined();
      expect(foundUsers.length).toEqual(1);
      expect(foundUsers[0]).toEqual(user);
    });
  });

  describe("findById", () => {
    it("should return a user", async () => {
      const user = await service.create(mockUser);
      const foundUser = await service.findById({ _id: user._id.toString() });

      expect(foundUser).toBeDefined();
      expect(foundUser).toEqual(user);
    });

    it("should throw an error", async () => {
      await expect(service.findById({ _id: "id" })).rejects.toThrow(NotFoundException);
    });
  });

  describe("findByEmail", () => {
    it("should return a user", async () => {
      const user = await service.create(mockUser);
      const foundUser = await service.findByEmail({ email: user.email });

      expect(foundUser).toBeDefined();
      expect(foundUser).toEqual(user);
    });

    it("should throw an error", async () => {
      await expect(service.findByEmail({ email: "" })).rejects.toThrow(NotFoundException);
    });
  });
});
