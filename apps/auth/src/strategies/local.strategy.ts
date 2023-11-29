import { Strategy } from "passport-local";

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { AuthService } from "../app/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({ usernameField: "email" });
	}

	async validate(email: string, password: string) {
		try {
			return await this.authService.verifyUser(email, password);
		} catch (error) {
			throw new UnauthorizedException("Invalid credentials");
		}
	}
}
