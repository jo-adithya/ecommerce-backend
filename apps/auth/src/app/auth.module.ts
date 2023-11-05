import Joi from "joi";

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { LoggerModule } from "@nx-micro-ecomm/server/logger";

import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
	imports: [
		LoggerModule,
		ConfigModule,
		UsersModule,
		JwtModule.registerAsync({
			useFactory: (configService: ConfigService) => ({
				secret: configService.get("JWT_SECRET"),
				signOptions: { expiresIn: `${configService.get("JWT_EXPIRATION")}s` },
			}),
			inject: [ConfigService],
		}),
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				MONGODB_URI: Joi.string().required(),
				JWT_SECRET: Joi.string().required(),
				JWT_EXPIRATION: Joi.number().required(),
				PORT: Joi.number().required(),
			}),
		}),
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
