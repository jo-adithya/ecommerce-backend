import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { ConfigModule } from "@nx-micro-ecomm/server/config";
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
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get("JWT_SECRET"),
				signOptions: { expiresIn: `${configService.get("JWT_EXPIRATION")}s` },
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
