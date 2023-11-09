import { Response } from "express";

import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";

import { CurrentUser } from "../decorators";
import { CreateUserDto } from "../dtos";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { User } from "../models/user.schema";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@Post("signin")
	async signIn(@CurrentUser() user: User, @Res({ passthrough: true }) response: Response) {
    const cookieOptions = { secure: true, httpOnly: true, sameSite: true };
		const { accessToken, refreshToken } = await this.authService.signIn(user);
    response.cookie("accessToken", accessToken, cookieOptions);
    response.cookie("refreshToken", refreshToken, cookieOptions);
		return user;
	}

	@Post("signup")
	async signUp(@Body() createUserDto: CreateUserDto) {
		return this.authService.signUp(createUserDto);
	}

	@Get()
	getData() {
		return this.authService.getData();
	}
}
