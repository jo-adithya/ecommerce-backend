import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

import { TokenPayload } from "../types";
import { UsersService } from "../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		configService: ConfigService,
		private readonly usersService: UsersService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					return request?.cookies?.accessToken;
				},
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
			secretOrKey: configService.get("JWT_SECRET"),
		});
	}

	async validate({ sub }: TokenPayload) {
		return this.usersService.findById({ _id: sub });
	}
}
