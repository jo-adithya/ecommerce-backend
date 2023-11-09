import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";

import { CurrentUser } from "../decorators";
import { CreateUserDto } from "../dtos/create-user.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { User } from "../models/user.schema";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	async create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Get()
	async findAll() {
		return this.usersService.findAll();
	}

	@Get("info")
	@UseGuards(JwtAuthGuard)
	async getUser(@CurrentUser() user: User) {
		return user;
	}
}
