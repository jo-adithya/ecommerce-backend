import { Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";

import { CreateUserDto, GetUserByEmailDto, GetUserByIdDto } from "../dtos";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);
    return this.usersRepository.create(createUserDto);
  }

  async findByEmail(getUserByEmailDto: GetUserByEmailDto) {
    return this.usersRepository.findOne(getUserByEmailDto);
  }

  async findById(getUserByIdDto: GetUserByIdDto) {
    return this.usersRepository.findOne(getUserByIdDto);
  }

  async findAll() {
    return this.usersRepository.find({});
  }

  async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email: createUserDto.email });
    } catch (error) {
      if (error instanceof NotFoundException) return;
      throw error;
    }
    throw new UnprocessableEntityException("Email already exists.");
  }
}
