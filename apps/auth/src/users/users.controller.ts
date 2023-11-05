import { Body, Controller, Post } from "@nestjs/common";

import { CreateUserDto } from "../dtos/create-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	async create(@Body() createUserDto: CreateUserDto) {
		this.usersService.create(createUserDto);
	}
}
