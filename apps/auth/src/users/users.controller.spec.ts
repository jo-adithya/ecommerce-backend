import { Types } from "mongoose";

import { UnprocessableEntityException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { UserDocument } from "../models/user.schema";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

describe("UsersController", () => {
  let controller: UsersController;
  let users: UserDocument[];
  let mockUsersService: Partial<UsersService>;

  const mockUser = { email: "email@gmail.com", password: "password" };

  beforeEach(async () => {
    // Initialize mock fns
    mockUsersService = {
      create: jest.fn((createUserDto) => {
        const existingUser = users.find((user) => user.email === createUserDto.email);
        if (existingUser) {
          return Promise.reject(new UnprocessableEntityException("Email already exists."));
        }

        const user = { ...createUserDto, _id: new Types.ObjectId() } as UserDocument;
        users.push(user);
        return Promise.resolve(user);
      }),

      findAll: jest.fn(() => Promise.resolve(users)),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    users = [];
    controller = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a user", async () => {
      const user = await controller.create(mockUser);
      expect(user).toBeDefined();
      expect(user.email).toEqual(mockUser.email);
      expect(user.password).toEqual(mockUser.password);
      expect(user._id).toBeDefined();
    });

    it("should throw an error if the email already exists", async () => {
      await controller.create(mockUser);
      await expect(controller.create(mockUser)).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe("findAll", () => {
    it("should return an empty array", async () => {
      const foundUsers = await controller.findAll();

      expect(foundUsers).toBeDefined();
      expect(foundUsers.length).toEqual(0);
    });

    it("should return an array of users", async () => {
      const user = await controller.create(mockUser);
      const foundUsers = await controller.findAll();

      expect(foundUsers).toBeDefined();
      expect(foundUsers.length).toEqual(1);
      expect(foundUsers[0]).toEqual(user);
    });
  });
});
