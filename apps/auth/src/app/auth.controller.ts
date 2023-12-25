import { Response } from "express";

import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";

import { CurrentUser } from "@nx-micro-ecomm/server/auth";
import { Serialize } from "@nx-micro-ecomm/server/interceptors";

import { CreateUserDto, UserDto } from "../dtos";
import { JwtAuthGuard, LocalAuthGuard } from "../guards";
import { User } from "../models/user.schema";
import { AuthService } from "./auth.service";

@Controller("auth")
@Serialize(UserDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("signin")
  async signIn(@CurrentUser() user: User, @Res({ passthrough: true }) response: Response) {
    const cookieOptions = { secure: false, httpOnly: true, sameSite: true } as const;
    const { accessToken, refreshToken } = await this.authService.signIn(user);
    response.cookie("accessToken", accessToken, cookieOptions);
    response.cookie("refreshToken", refreshToken, cookieOptions);
    return user;
  }

  @Post("signup")
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("iam")
  async iam(@CurrentUser() user: User) {
    return user;
  }

  @UseGuards(LocalAuthGuard)
  @Post("signout")
  async signOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie("accessToken");
    response.clearCookie("refreshToken");
  }
}
